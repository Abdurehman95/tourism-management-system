<?php

declare(strict_types=1);

namespace App\Models;

class Payment
{
    public int $payment_id;
    public int $request_id;
    public float $total_amount;
    public string $payment_status;
    public ?string $reference_code = null;
    public ?int $payment_method_id = null;
    public ?string $paid_at = null;
    public ?int $confirmed_by = null;
    public ?string $confirmed_at = null;
}
