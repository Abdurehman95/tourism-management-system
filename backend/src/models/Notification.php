<?php

declare(strict_types=1);

namespace App\Models;

class Notification
{
    public int $notification_id;
    public int $user_id;
    public string $title;
    public string $body;
    public bool $is_read = false;
    public ?string $created_at = null;
}
