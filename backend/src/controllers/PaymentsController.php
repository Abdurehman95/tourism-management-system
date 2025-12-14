<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\FileService;
use App\Services\PaymentService;

use App\Services\NotificationService;

class PaymentsController
{
    public function __construct(private PaymentService $paymentService, private FileService $fileService, private NotificationService $notifications)
    {
    }

    public function createChapa(array $input): array
    {
        $requestId = (int) ($input['request_id'] ?? 0);
        $amount = (float) ($input['amount'] ?? 0);

        if ($requestId <= 0 || $amount <= 0) {
            return [
                '_status' => 400,
                'error' => 'request_id and amount are required.',
            ];
        }

        return $this->paymentService->initializeChapaPayment($requestId, $amount);
    }

    public function uploadProof(array $files, array $input): array
    {
        $paymentId = (int) ($input['payment_id'] ?? 0);

        if ($paymentId <= 0) {
            return [
                '_status' => 400,
                'error' => 'payment_id is required.',
            ];
        }

        if (!isset($files['file'])) {
            return [
                '_status' => 400,
                'error' => 'file field is required.',
            ];
        }

        $fileUrl = $this->fileService->savePaymentProof($files['file'], $paymentId);
        $amountPaid = isset($input['amount_paid']) ? (float) $input['amount_paid'] : null;

        return $this->paymentService->attachProof($paymentId, $fileUrl, $amountPaid);
    }

    public function list(?int $requestId = null): array
    {
        return $this->paymentService->listPayments($requestId);
    }

    public function verify(int $paymentId, array $context): array
    {
        $res = $this->paymentService->verifyPaymentById($paymentId, $context);

        $details = $this->paymentService->getPaymentDetails($paymentId);
        if ($details && $details['visitor_id']) {
            $this->notifications->create(
                (int) $details['visitor_id'],
                'Payment Verified',
                "Your payment for request #{$details['request_id']} has been verified.",
                'payment',
                (int) $details['request_id'],
                $paymentId
            );
        }

        return $res;
    }

    public function verifyByTxRef(string $txRef): array
    {
        $res = $this->paymentService->verifyChapaPayment($txRef);

        $details = $this->paymentService->getPaymentDetailsByTxRef($txRef);
        if ($details && $details['visitor_id']) {
            $this->notifications->create(
                (int) $details['visitor_id'],
                'Payment Verified',
                "Your Chapa payment for request #{$details['request_id']} was successful.",
                'payment',
                (int) $details['request_id'],
                (int) $details['payment_id']
            );
            // Also notify admin of successful payment
            $this->notifications->notifyAdmins(
                'Payment Received',
                "A Chapa payment of {$details['total_amount']} ETB has been received for request #{$details['request_id']}.",
                'payment',
                (int) $details['request_id'],
                (int) $details['payment_id']
            );
        }

        return $res;
    }
}
