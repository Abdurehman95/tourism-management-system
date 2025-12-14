<?php

declare(strict_types=1);

namespace App\Services;

use PDO;

class NotificationService
{
    public function __construct(private PDO $db)
    {
    }

    public function create(int $userId, string $title, string $message, string $type, ?int $requestId = null, ?int $paymentId = null): void
    {
        try {
            $stmt = $this->db->prepare(
                'INSERT INTO Notifications (user_id, title, message, notification_type, related_request_id, related_payment_id)
                 VALUES (:user_id, :title, :message, :type, :request_id, :payment_id)'
            );
            $stmt->execute([
                'user_id' => $userId,
                'title' => $title,
                'message' => $message,
                'type' => $type,
                'request_id' => $requestId,
                'payment_id' => $paymentId,
            ]);
        } catch (\Throwable $e) {
            // Silently fail or log error so main flow isn't interrupted
            error_log("Notification Create Error: " . $e->getMessage());
        }
    }

    public function notifyAdmins(string $title, string $message, string $type, ?int $requestId = null, ?int $paymentId = null): void
    {
        // Find all admins
        $stmt = $this->db->query("SELECT user_id FROM Users WHERE user_type = 'admin'");
        $admins = $stmt->fetchAll(PDO::FETCH_COLUMN);

        foreach ($admins as $adminId) {
            $this->create((int) $adminId, $title, $message, $type, $requestId, $paymentId);
        }
    }
}
