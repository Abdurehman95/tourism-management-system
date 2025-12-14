<?php
$users = [
    'y@gmail.com' => '$2y$10$gB55ZI4Fgr8grVc2uY63v.oZJ8Moq.h7zmmRq5.5ti6HmRYedSkvW',
    'ya@gmail.com' => '$2y$10$29BSEXKbBU7ksYN/CBT7ZO5mP9f6PvfxSFWwPBvkikRxGRDdfK33C'
];

foreach ($users as $email => $hash) {
    $match = password_verify('password123', $hash);
    echo "User $email: " . ($match ? "Password matches" : "Password DOES NOT match") . "\n";
}
