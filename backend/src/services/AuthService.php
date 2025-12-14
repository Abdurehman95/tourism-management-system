<?php

declare(strict_types=1);

namespace App\Services;

use App\Config\Env;
use Firebase\JWT\JWT;
use PDO;

class AuthService
{
    public function __construct(private PDO $db)
    {
    }

    public function register(array $input): array
    {
        $required = ['first_name', 'last_name', 'email', 'password', 'user_type'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                return [
                    '_status' => 400,
                    'error' => "$field is required",
                ];
            }
        }

        $email = strtolower(trim((string) $input['email']));

        // Reject duplicate email
        $exists = $this->db->prepare('SELECT user_id FROM Users WHERE email = :email LIMIT 1');
        $exists->execute(['email' => $email]);
        if ($exists->fetchColumn()) {
            return [
                '_status' => 409,
                'error' => 'Email already registered',
            ];
        }

        $passwordHash = password_hash((string) $input['password'], PASSWORD_BCRYPT);

        $userType = $input['user_type'];
        if ($userType === 'guide') {
            $userType = 'site_agent';
        }

        $stmt = $this->db->prepare(
            'INSERT INTO Users (first_name, last_name, email, phone_number, password_hash, profile_picture, user_type)
             VALUES (:first_name, :last_name, :email, :phone_number, :password_hash, :profile_picture, :user_type)'
        );

        $stmt->execute([
            'first_name' => $input['first_name'],
            'last_name' => $input['last_name'],
            'email' => $email,
            'phone_number' => $input['phone_number'] ?? null,
            'password_hash' => $passwordHash,
            'profile_picture' => $input['profile_picture'] ?? null,
            'user_type' => $userType,
        ]);

        $userId = (int) $this->db->lastInsertId();

        return [
            'message' => 'Registered successfully',
            'user_id' => $userId,
            'token' => $this->issueToken([
                'sub' => $userId,
                'role' => $input['user_type'],
                'email' => $email,
            ]),
        ];
    }

    public function login(array $input): array
    {
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');

        if ($email === '' || $password === '') {
            return [
                '_status' => 400,
                'error' => 'email and password are required',
            ];
        }

        $stmt = $this->db->prepare('SELECT user_id, email, password_hash, user_type, first_name, last_name FROM Users WHERE email = :email LIMIT 1');
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            return [
                '_status' => 401,
                'error' => 'Invalid credentials',
            ];
        }

        return [
            'token' => $this->issueToken([
                'sub' => (int) $user['user_id'],
                'role' => $user['user_type'],
                'email' => $user['email'],
            ]),
            'user' => [
                'user_id' => (int) $user['user_id'],
                'email' => $user['email'],
                'first_name' => $user['first_name'],
                'last_name' => $user['last_name'],
                'user_type' => $user['user_type'],
            ],
        ];
    }

    public function currentUser(array $context): array
    {
        $userId = (int) ($context['sub'] ?? 0);
        $stmt = $this->db->prepare('SELECT user_id, first_name, last_name, email, phone_number, profile_picture, user_type, is_active, created_at FROM Users WHERE user_id = :id');
        $stmt->execute(['id' => $userId]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return ['_status' => 404, 'error' => 'User not found'];
        }

        return ['user' => $user];
    }

    public function updateProfile(array $context, array $input): array
    {
        $userId = (int) ($context['sub'] ?? 0);
        if ($userId <= 0) {
            return ['_status' => 401, 'error' => 'Unauthorized'];
        }

        $fields = [
            'first_name' => $input['first_name'] ?? null,
            'last_name' => $input['last_name'] ?? null,
            'phone_number' => $input['phone_number'] ?? null,
            'profile_picture' => $input['profile_picture'] ?? null,
        ];

        if (isset($input['email']) && $input['email'] !== '') {
            $newEmail = strtolower(trim((string) $input['email']));
            // Uniqueness check
            $stmt = $this->db->prepare("SELECT user_id FROM Users WHERE email = ? AND user_id != ?");
            $stmt->execute([$newEmail, $userId]);
            if ($stmt->fetchColumn()) {
                return ['_status' => 409, 'error' => 'Email already in use'];
            }
            $fields['email'] = $newEmail;
        }

        $setParts = [];
        $params = ['user_id' => $userId];
        foreach ($fields as $column => $value) {
            if ($value !== null) {
                $setParts[] = "$column = :$column";
                $params[$column] = $value;
            }
        }

        if (isset($input['password']) && $input['password'] !== '') {
            $setParts[] = 'password_hash = :password_hash';
            $params['password_hash'] = password_hash((string) $input['password'], PASSWORD_BCRYPT);
        }

        if (empty($setParts)) {
            return ['message' => 'No changes'];
        }

        $sql = 'UPDATE Users SET ' . implode(', ', $setParts) . ' WHERE user_id = :user_id';
        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);

        return ['message' => 'Profile updated'];
    }

    private function issueToken(array $claims): string
    {
        $secret = Env::get('JWT_SECRET', 'change-me');

        $claims['iat'] = time();
        $claims['exp'] = time() + 3600 * 24 * 7;

        return JWT::encode($claims, $secret, 'HS256');
    }
}
