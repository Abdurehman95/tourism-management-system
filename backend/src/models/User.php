<?php

declare(strict_types=1);

namespace App\Models;

class User
{
    public int $user_id;
    public string $full_name;
    public string $role;
    public string $email;
    public ?string $phone = null;
    public ?string $profile_picture = null;
    public string $password_hash;
}
