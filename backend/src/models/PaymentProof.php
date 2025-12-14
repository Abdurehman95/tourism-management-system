<?php

declare(strict_types=1);

namespace App\Models;

class PaymentProof
{
    public int $proof_id;
    public int $payment_id;
    public ?float $amount_paid = null;
    public string $file_url;
    public ?string $created_at = null;
}
