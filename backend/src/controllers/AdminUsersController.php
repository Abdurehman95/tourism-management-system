<?php

declare(strict_types=1);

namespace App\Controllers;

use PDO;

class AdminUsersController
{
    public function __construct(private PDO $db)
    {
    }

    public function list(): array
    {
        $stmt = $this->db->query('SELECT user_id, first_name, last_name, email, phone_number, user_type, is_active, created_at FROM Users ORDER BY user_id DESC');
        return ['users' => $stmt->fetchAll()];
    }

    public function create(array $input): array
    {
        // password can be omitted; default to 'password123'
        $required = ['first_name', 'last_name', 'email', 'user_type'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                return ['_status' => 400, 'error' => "$field is required"];
            }
        }

        $plainPassword = trim((string) ($input['password'] ?? ''));
        if ($plainPassword === '') {
            $plainPassword = 'password123';
        }

        $email = strtolower(trim((string) $input['email']));
        $exists = $this->db->prepare('SELECT user_id FROM Users WHERE email = :email LIMIT 1');
        $exists->execute(['email' => $email]);
        if ($exists->fetchColumn()) {
            return ['_status' => 409, 'error' => 'Email already exists'];
        }

        $userType = $input['user_type'];
        // Normalize: store site agents explicitly as site_agent; map any legacy "guide" to site_agent
        if ($userType === 'site_agent') {
            $userType = 'guide';
        }

        $stmt = $this->db->prepare(
            'INSERT INTO Users (first_name, last_name, email, phone_number, password_hash, profile_picture, user_type, is_active)
             VALUES (:first_name, :last_name, :email, :phone_number, :password_hash, :profile_picture, :user_type, :is_active)'
        );

        $stmt->execute([
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'email' => $email,
            'phone_number' => $input['phone_number'] ?? null,
            'password_hash' => password_hash($plainPassword, PASSWORD_BCRYPT),
            'profile_picture' => $input['profile_picture'] ?? null,
            'user_type' => $userType,
            'is_active' => isset($input['is_active']) ? (bool) $input['is_active'] : true,
        ]);

        return [
            'message' => 'User created',
            'user_id' => (int) $this->db->lastInsertId(),
            'temp_password' => $plainPassword,
        ];
    }

    public function updateStatus(int $userId, array $input): array
    {
        if (!isset($input['is_active'])) {
            return ['_status' => 400, 'error' => 'is_active is required'];
        }

        $stmt = $this->db->prepare('UPDATE Users SET is_active = :is_active WHERE user_id = :id');
        $stmt->execute([
            'is_active' => (bool) $input['is_active'],
            'id' => $userId,
        ]);

        return ['message' => 'User status updated', 'user_id' => $userId];
    }

    public function delete(int $userId): array
    {
        try {
            $this->db->beginTransaction();

            // 1. Nullify references where it makes sense to keep the data
            // Sites created/approved by user
            $this->db->prepare("UPDATE Sites SET created_by = NULL WHERE created_by = ?")->execute([$userId]);
            $this->db->prepare("UPDATE Sites SET approved_by = NULL WHERE approved_by = ?")->execute([$userId]);

            // Site Images uploaded by user
            $this->db->prepare("UPDATE SiteImages SET uploaded_by = NULL WHERE uploaded_by = ?")->execute([$userId]);

            // Guide Requests references (visitor or assigned guide)
            // If we delete the user, we should probably keep the request but nullify the user
            $this->db->prepare("UPDATE GuideRequests SET visitor_id = NULL WHERE visitor_id = ?")->execute([$userId]);
            $this->db->prepare("UPDATE GuideRequests SET assigned_guide_id = NULL WHERE assigned_guide_id = ?")->execute([$userId]);

            // Site Submissions references
            $this->db->prepare("UPDATE SiteSubmissions SET researcher_id = NULL WHERE researcher_id = ?")->execute([$userId]);
            $this->db->prepare("UPDATE SiteSubmissions SET reviewed_by = NULL WHERE reviewed_by = ?")->execute([$userId]);

            // Payments confirmed by user
            $this->db->prepare("UPDATE Payments SET confirmed_by = NULL WHERE confirmed_by = ?")->execute([$userId]);

            // 2. Delete data owned strictly by the user or log data
            // Researcher Activities - okay to delete logs or nullify. Let's delete to clean up.
            $this->db->prepare("DELETE FROM ResearcherActivities WHERE researcher_id = ?")->execute([$userId]);

            // Notifications sent to the user
            $this->db->prepare("DELETE FROM Notifications WHERE user_id = ?")->execute([$userId]);

            // Reviews by the user (visitor)
            $this->db->prepare("DELETE FROM Reviews WHERE visitor_id = ?")->execute([$userId]);

            // 3. User Roles (Cascade should handle this but manual check is safe)
            $this->db->prepare("DELETE FROM UserRoles WHERE user_id = ?")->execute([$userId]);

            // 4. Finally delete the User
            $stmt = $this->db->prepare('DELETE FROM Users WHERE user_id = :id');
            $stmt->execute(['id' => $userId]);

            if ($stmt->rowCount() === 0) {
                $this->db->rollBack();
                return ['_status' => 404, 'error' => 'User not found'];
            }

            $this->db->commit();
            return ['message' => 'User deleted', 'user_id' => $userId];

        } catch (\Throwable $e) {
            if ($this->db->inTransaction()) {
                $this->db->rollBack();
            }
            return ['_status' => 500, 'error' => 'Failed to delete user: ' . $e->getMessage()];
        }
    }
}
