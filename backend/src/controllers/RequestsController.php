<?php

declare(strict_types=1);

namespace App\Controllers;

use App\Services\PaymentService;
use PDO;

use App\Services\NotificationService;

class RequestsController
{
    public function __construct(private PDO $db, private PaymentService $paymentService, private NotificationService $notifications)
    {
    }

    public function create(array $context, array $input): array
    {
        $visitorId = (int) ($context['sub'] ?? 0);
        if ($visitorId <= 0) {
            return ['_status' => 401, 'error' => 'Unauthorized'];
        }

        $required = ['site_id', 'preferred_date', 'preferred_time', 'number_of_visitors'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                return ['_status' => 400, 'error' => "$field is required"];
            }
        }

        $stmt = $this->db->prepare(
            'INSERT INTO GuideRequests (visitor_id, visitor_name, visitor_contact, site_id, guide_type_id, preferred_date, preferred_time, number_of_visitors, special_requirements, meeting_point, request_status)
             VALUES (:visitor_id, :visitor_name, :visitor_contact, :site_id, :guide_type_id, :preferred_date, :preferred_time, :number_of_visitors, :special_requirements, :meeting_point, :request_status)'
        );

        $stmt->execute([
            'visitor_id' => $visitorId,
            'visitor_name' => $input['visitor_name'] ?? null,
            'visitor_contact' => $input['visitor_contact'] ?? null,
            'site_id' => (int) $input['site_id'],
            'guide_type_id' => $input['guide_type_id'] ?? null,
            'preferred_date' => $input['preferred_date'],
            'preferred_time' => $input['preferred_time'],
            'number_of_visitors' => (int) $input['number_of_visitors'],
            'special_requirements' => $input['special_requirements'] ?? null,
            'meeting_point' => $input['meeting_point'] ?? null,
            'request_status' => 'pending',
        ]);

        $requestId = (int) $this->db->lastInsertId();

        // Fetch visitor name
        $visitorName = "Visitor #$visitorId";
        try {
            $uStmt = $this->db->prepare("SELECT first_name, last_name FROM Users WHERE user_id = ?");
            $uStmt->execute([$visitorId]);
            $visitor = $uStmt->fetch();
            if ($visitor) {
                $visitorName = $visitor['first_name'] . ' ' . $visitor['last_name'];
            }
        } catch (\Exception $e) {
        }

        $this->notifications->notifyAdmins(
            'New Guide Request',
            "A new guide request has been submitted by $visitorName.",
            'guide_request',
            $requestId
        );

        return [
            'message' => 'Request created',
            'request_id' => $requestId,
            'request_status' => 'pending',
        ];
    }

    public function listForVisitor(int $visitorId): array
    {
        $sql = '
            SELECT r.*, s.site_name, s.visit_price as amount 
            FROM GuideRequests r
            LEFT JOIN Sites s ON r.site_id = s.site_id
            WHERE r.visitor_id = :visitor_id 
            ORDER BY r.created_at DESC
        ';
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['visitor_id' => $visitorId]);
        return [
            'requests' => $stmt->fetchAll(),
            'visitor_id' => $visitorId,
        ];
    }

    public function listAll(array $context = []): array
    {
        $sql = '
            SELECT r.*, 
                   COALESCE(r.visitor_name, CONCAT(u.first_name, " ", u.last_name)) as visitor_name, 
                   r.visitor_contact,
                   s.site_name 
            FROM GuideRequests r
            LEFT JOIN Users u ON r.visitor_id = u.user_id
            LEFT JOIN Sites s ON r.site_id = s.site_id
            ORDER BY r.created_at DESC
        ';
        $params = [];

        // If guide, filter by assigned requests OR approved requests needing a guide
        if (isset($context['role']) && ($context['role'] === 'guide' || $context['role'] === 'site_agent')) {
            $guideId = (int) ($context['sub'] ?? 0);
            $sql = '
                SELECT r.*, 
                       COALESCE(r.visitor_name, CONCAT(u.first_name, " ", u.last_name)) as visitor_name, 
                       r.visitor_contact,
                       s.site_name 
                FROM GuideRequests r
                LEFT JOIN Users u ON r.visitor_id = u.user_id
                LEFT JOIN Sites s ON r.site_id = s.site_id
                WHERE r.assigned_guide_id = :guide_id 
                   OR (r.request_status = "approved" AND r.assigned_guide_id IS NULL)
                ORDER BY r.created_at DESC
            ';
            $params['guide_id'] = $guideId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return [
            'requests' => $stmt->fetchAll(),
        ];
    }

    public function approve(int $requestId): array
    {
        if (!$this->paymentService->hasConfirmedPayment($requestId)) {
            return [
                '_status' => 400,
                'error' => 'Visitor has not paid or payment not verified.',
            ];
        }

        $stmt = $this->db->prepare('UPDATE GuideRequests SET request_status = "approved" WHERE request_id = :id');
        $stmt->execute(['id' => $requestId]);

        // --- Create Visit Record ---
        try {
            $req = $this->db->prepare("SELECT * FROM GuideRequests WHERE request_id = :id");
            $req->execute(['id' => $requestId]);
            $request = $req->fetch();

            if ($request) {
                $stmt = $this->db->prepare(
                    "INSERT INTO Visits (request_id, actual_visit_date, actual_visit_time, status)
                     VALUES (:rid, :date, :time, 'upcoming')"
                );
                $stmt->execute([
                    'rid' => $requestId,
                    'date' => $request['preferred_date'],
                    'time' => $request['preferred_time']
                ]);
            }
        } catch (\Throwable $e) {
            // ignore
        }
        // ---------------------------

        // Notify Visitor
        if (isset($request['visitor_id'])) {
            $this->notifications->create(
                (int) $request['visitor_id'],
                'Request Approved',
                "Your guide request #$requestId has been approved.",
                'guide_request',
                $requestId
            );
        }

        return [
            'message' => 'Request approved',
            'request_id' => $requestId,
        ];
    }

    public function reject(int $requestId): array
    {
        $stmt = $this->db->prepare('UPDATE GuideRequests SET request_status = "rejected" WHERE request_id = :id');
        $stmt->execute(['id' => $requestId]);

        // Notify Visitor
        $stmt = $this->db->prepare("SELECT visitor_id FROM GuideRequests WHERE request_id = ?");
        $stmt->execute([$requestId]);
        $visitorId = $stmt->fetchColumn();
        if ($visitorId) {
            $this->notifications->create(
                (int) $visitorId,
                'Request Rejected',
                "Your guide request #$requestId has been rejected.",
                'guide_request',
                $requestId
            );
        }

        return [
            'message' => 'Request rejected',
            'request_id' => $requestId,
        ];
    }

    public function assignGuide(int $requestId, int $guideId): array
    {
        $stmt = $this->db->prepare('UPDATE GuideRequests SET assigned_guide_id = :guide_id WHERE request_id = :id');
        $stmt->execute([
            'guide_id' => $guideId,
            'id' => $requestId,
        ]);

        $this->notifications->create(
            $guideId,
            'New Assignment',
            "You have been assigned to guide request #$requestId.",
            'guide_request',
            $requestId
        );

        return [
            'message' => 'Guide assigned',
            'request_id' => $requestId,
            'assigned_guide_id' => $guideId,
        ];
    }

    public function updateStatus(int $requestId, string $status, array $context): array
    {
        $stmt = $this->db->prepare('UPDATE GuideRequests SET request_status = :status WHERE request_id = :id');
        $stmt->execute([
            'status' => $status,
            'id' => $requestId,
        ]);

        // Notify visitor if guide accepted or rejected
        if (in_array($status, ['accepted_by_guide', 'rejected_by_guide'])) {
            $stmt = $this->db->prepare("SELECT visitor_id FROM GuideRequests WHERE request_id = ?");
            $stmt->execute([$requestId]);
            $visitorId = $stmt->fetchColumn();
            if ($visitorId) {
                $title = $status === 'accepted_by_guide' ? 'Request Accepted' : 'Request Rejected by Guide';
                $message = $status === 'accepted_by_guide'
                    ? "A site agent has accepted your guide request #$requestId."
                    : "A site agent has rejected your guide request #$requestId.";
                $this->notifications->create(
                    (int) $visitorId,
                    $title,
                    $message,
                    'guide_request',
                    $requestId
                );
            }
        }

        return [
            'message' => 'Request status updated',
            'request_id' => $requestId,
            'status' => $status,
            'updated_by' => $context['sub'] ?? null,
        ];
    }
}
