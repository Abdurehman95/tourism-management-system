<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class ReviewsController
{
    public function __construct(private PDO $db)
    {
    }

    public function create(array $context, array $input): array
    {
        $visitorId = (int) ($context['sub'] ?? 0);
        if ($visitorId <= 0) {
            return ['_status' => 401, 'error' => 'Unauthorized'];
        }

        $required = ['site_id', 'visit_id', 'rating'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                return ['_status' => 400, 'error' => "$field is required"];
            }
        }

        $stmt = $this->db->prepare(
            'INSERT INTO Reviews (visitor_id, site_id, visit_id, rating, comment, is_approved)
             VALUES (:visitor_id, :site_id, :visit_id, :rating, :comment, 0)'
        );

        $stmt->execute([
            'visitor_id' => $visitorId,
            'site_id' => (int) $input['site_id'],
            'visit_id' => (int) $input['visit_id'],
            'rating' => (int) $input['rating'],
            'comment' => $input['comment'] ?? null,
        ]);

        return [
            'message' => 'Review submitted for approval',
            'review_id' => (int) $this->db->lastInsertId(),
        ];
    }

    public function list(?int $siteId = null): array
    {
        $sql = 'SELECT r.*, u.first_name, u.last_name 
                FROM Reviews r 
                JOIN Users u ON r.visitor_id = u.user_id 
                WHERE r.is_approved = 1';
        $params = [];

        if ($siteId) {
            $sql .= ' AND r.site_id = :site_id';
            $params['site_id'] = $siteId;
        }

        $sql .= ' ORDER BY r.created_at DESC';

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return [
            'items' => $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [],
        ];
    }
}
