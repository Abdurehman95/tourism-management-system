<?php

declare(strict_types=1);

namespace App\Models;

class Site
{
    public int $site_id;
    public string $name;
    public string $description;
    public string $location;
    public ?string $status = null;
}
