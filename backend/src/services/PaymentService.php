<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Env;
use GuzzleHttp\Client;
use PDO;

class PaymentService
{
    private Client $http;

    public function __construct(private PDO $db)
    {
        $this->http = new Client([
            'base_uri' => 'https://api.chapa.co/v1/',
            'timeout' => 10,
        ]);
    }

    public function initializeChapaPayment(int $requestId, float $amount, string $currency = 'ETB'): array
    {
        $txRef = 'TX-' . bin2hex(random_bytes(6));

        $payload = [
            'amount' => $amount,
            'currency' => $currency,
            'tx_ref' => $txRef,
            'callback_url' => Env::get('API_URL', '') . '/api/payments/chapa/verify/' . $txRef,
            'return_url' => Env::get('APP_URL', ''),
            'payment_method_id' => null,
        ];

        // Persist pending payment row
        $stmt = $this->db->prepare(
            'INSERT INTO Payments (request_id, payment_method_id, total_amount, reference_code, payment_status)
             VALUES (:request_id, :payment_method_id, :total_amount, :reference_code, :payment_status)'
        );
        $stmt->execute([
            'request_id' => $requestId,
            'payment_method_id' => $payload['payment_method_id'] ?? null,
            'total_amount' => $amount,
            'reference_code' => $txRef,
            'payment_status' => 'waiting',
        ]);

        $secret = Env::get('CHAPA_SECRET_KEY');
        if (!$secret) {
            return [
                '_status' => 202,
                'message' => 'CHAPA_SECRET_KEY not set. Returning a local tx_ref stub.',
                'tx_ref' => $txRef,
                'payload' => $payload,
            ];
        }

        try {
            $response = $this->http->post('transaction/initialize', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $secret,
                ],
                'json' => $payload,
            ]);
            $data = json_decode((string) $response->getBody(), true);
        } catch (\Throwable $e) {
            return [
                '_status' => 500,
                'error' => 'Chapa initialization failed',
                'detail' => $e->getMessage(),
            ];
        }

        if (($data['status'] ?? 'failed') !== 'success') {
            return [
                '_status' => 400,
                'error' => 'Chapa API Error: ' . ($data['message'] ?? 'Unknown error'),
            ];
        }

        $checkoutUrl = $data['data']['checkout_url'] ?? '';

        return [
            'tx_ref' => $txRef,
            'checkout_url' => $checkoutUrl,
            'message' => 'Payment initialized',
        ];
    }

    public function verifyChapaPayment(string $txRef): array
    {
        $secret = Env::get('CHAPA_SECRET_KEY');
        if (!$secret) {
            return [
                '_status' => 202,
                'message' => 'CHAPA_SECRET_KEY not set. Skipping remote verification.',
                'tx_ref' => $txRef,
            ];
        }

        try {
            $response = $this->http->get('transaction/verify/' . $txRef, [
                'headers' => [
                    'Authorization' => 'Bearer ' . $secret,
                ],
            ]);
            $data = json_decode((string) $response->getBody(), true);
        } catch (\Throwable $e) {
            return [
                '_status' => 500,
                'error' => 'Chapa verification failed',
                'detail' => $e->getMessage(),
            ];
        }

        if (($data['status'] ?? 'failed') !== 'success' || ($data['data']['status'] ?? '') !== 'success') {
            return [
                'tx_ref' => $txRef,
                'status' => 'failed',
                'message' => 'Payment verification failed or invalid',
            ];
        }

        // Mark payment as paid (or keep pending) locally. Here we set paid -> confirmed for simplicity.
        $stmt = $this->db->prepare(
            "UPDATE Payments SET payment_status = 'confirmed', paid_at = NOW() WHERE reference_code = :tx_ref"
        );
        $stmt->execute(['tx_ref' => $txRef]);

        return [
            'tx_ref' => $txRef,
            'status' => 'confirmed',
            'message' => 'Payment successfully verified via Chapa',
        ];
    }

    public function verifyPaymentById(int $paymentId, array $context): array
    {
        $confirmedBy = (int) ($context['sub'] ?? 0);

        // Update payment status
        $stmt = $this->db->prepare(
            "UPDATE Payments SET payment_status = 'confirmed', confirmed_by = :confirmed_by, confirmed_at = NOW() WHERE payment_id = :payment_id"
        );
        $stmt->execute([
            'confirmed_by' => $confirmedBy ?: null,
            'payment_id' => $paymentId,
        ]);

        // Get payment amount for proof record
        $stmt = $this->db->prepare("SELECT total_amount, reference_code FROM Payments WHERE payment_id = ?");
        $stmt->execute([$paymentId]);
        $payment = $stmt->fetch(\PDO::FETCH_ASSOC);

        // Insert verification record in PaymentProofs
        if ($payment) {
            try {
                $stmt = $this->db->prepare(
                    "INSERT INTO PaymentProofs (payment_id, file_url, transaction_id, amount_paid, payment_date) 
                     VALUES (:payment_id, :file_url, :transaction_id, :amount_paid, CURDATE())"
                );
                $stmt->execute([
                    'payment_id' => $paymentId,
                    'file_url' => 'admin_verified',
                    'transaction_id' => $payment['reference_code'] ?? null,
                    'amount_paid' => $payment['total_amount'] ?? 0,
                ]);
            } catch (\Throwable $e) {
                // Ignore if proof already exists (unique constraint)
            }
        }

        return [
            'message' => 'Payment verified',
            'payment_id' => $paymentId,
            'confirmed_by' => $confirmedBy ?: null,
        ];
    }

    public function hasConfirmedPayment(int $requestId): bool
    {
        try {
            $stmt = $this->db->prepare(
                "SELECT payment_id FROM Payments WHERE request_id = :request_id AND payment_status = 'confirmed' LIMIT 1"
            );
            $stmt->execute(['request_id' => $requestId]);
            return (bool) $stmt->fetchColumn();
        } catch (\Throwable $e) {
            return false;
        }
    }

    public function listPayments(?int $requestId = null): array
    {
        if ($requestId === null) {
            try {
                $stmt = $this->db->query("
                    SELECT p.*, r.visitor_id, 
                           COALESCE(u.first_name, u.email) as visitor_name, 
                           s.site_name as site
                    FROM Payments p
                    LEFT JOIN GuideRequests r ON p.request_id = r.request_id
                    LEFT JOIN Users u ON r.visitor_id = u.user_id
                    LEFT JOIN Sites s ON r.site_id = s.site_id
                    ORDER BY p.created_at DESC
                ");
                return ['payments' => $stmt->fetchAll()];
            } catch (\Throwable $e) {
                return [
                    '_status' => 500,
                    'error' => 'Unable to load payments',
                    'details' => $e->getMessage(),
                ];
            }
        }

        try {
            $stmt = $this->db->prepare('SELECT * FROM Payments WHERE request_id = :request_id');
            $stmt->execute(['request_id' => $requestId]);
            return ['payments' => $stmt->fetchAll()];
        } catch (\Throwable $e) {
            return [
                '_status' => 500,
                'error' => 'Unable to load payments',
                'details' => $e->getMessage(),
            ];
        }
    }

    public function attachProof(int $paymentId, string $fileUrl, ?float $amount = null): array
    {
        $stmt = $this->db->prepare(
            'INSERT INTO PaymentProofs (payment_id, file_url, amount_paid)
             VALUES (:payment_id, :file_url, :amount_paid)'
        );
        $stmt->execute([
            'payment_id' => $paymentId,
            'file_url' => $fileUrl,
            'amount_paid' => $amount,
        ]);

        return [
            'message' => 'Proof saved',
            'payment_id' => $paymentId,
            'file_url' => $fileUrl,
            'amount_paid' => $amount,
        ];
    }
    public function getPaymentDetails(int $paymentId): ?array
    {
        $stmt = $this->db->prepare("
            SELECT p.*, r.visitor_id, r.request_id 
            FROM Payments p 
            JOIN GuideRequests r ON p.request_id = r.request_id 
            WHERE p.payment_id = :id
        ");
        $stmt->execute(['id' => $paymentId]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }

    public function getPaymentDetailsByTxRef(string $txRef): ?array
    {
        $stmt = $this->db->prepare("
            SELECT p.*, r.visitor_id, r.request_id 
            FROM Payments p 
            JOIN GuideRequests r ON p.request_id = r.request_id 
            WHERE p.reference_code = :ref
        ");
        $stmt->execute(['ref' => $txRef]);
        $res = $stmt->fetch(PDO::FETCH_ASSOC);
        return $res ?: null;
    }
}
