<?php

declare(strict_types=1);

namespace App\Models;

class Request
{
    public int $request_id;
    public int $visitor_id;
    public int $site_id;
    public string $request_status;
    public ?int $assigned_guide_id = null;
    public ?string $scheduled_date = null;
    public ?string $notes = null;
    public ?string $created_at = null;
}
