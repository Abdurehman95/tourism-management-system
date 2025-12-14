<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class HealthController
{
    public function __construct(private PDO $db)
    {
    }

    public function status(): array
    {
        try {
            $stmt = $this->db->query('SELECT 1');
            $stmt->fetchColumn();
            return [
                'status' => 'ok',
                'db' => 'connected',
            ];
        } catch (\Throwable $e) {
            return [
                '_status' => 500,
                'status' => 'error',
                'db' => 'unreachable',
                'details' => $e->getMessage(),
            ];
        }
    }
}
