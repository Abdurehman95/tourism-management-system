<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class NotificationsController
{
    public function __construct(private PDO $db)
    {
    }

    public function index(array $context): array
    {
        $userId = (int) ($context['sub'] ?? 0);
        if ($userId <= 0) {
            return ['_status' => 401, 'error' => 'Unauthorized'];
        }

        $stmt = $this->db->prepare('SELECT * FROM Notifications WHERE user_id = :user_id ORDER BY created_at DESC');
        $stmt->execute(['user_id' => $userId]);
        
        return [
            'items' => $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [],
            'user_id' => $userId,
        ];
    }

    public function markRead(int $notificationId, array $context): array
    {
        $userId = (int) ($context['sub'] ?? 0);
        if ($userId <= 0) {
            return ['_status' => 401, 'error' => 'Unauthorized'];
        }

        $stmt = $this->db->prepare('UPDATE Notifications SET is_read = 1 WHERE notification_id = :id AND user_id = :user_id');
        $stmt->execute(['id' => $notificationId, 'user_id' => $userId]);

        if ($stmt->rowCount() === 0) {
            return ['_status' => 404, 'error' => 'Notification not found or not owned by user'];
        }

        return [
            'message' => 'Notification marked as read',
            'notification_id' => $notificationId,
        ];
    }
}
