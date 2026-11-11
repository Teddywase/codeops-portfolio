<?php
declare(strict_types=1);

const FREE_DELIVERY_FROM = 500.00;

// function deliveryFee(string $area, int $subTotal): int
// {
//     if ($subTotal >= FREE_DELIVERY_FROM) {
//         return 0;
//     }
//     return match ($area) {
//         'Bole', 'Kazanchis' => 4500,
//         'Piassa', 'Megenagna' => 6000,
//         'CMC', 'Ayat' => 7000,
//         default => 8000,
//     };
// }

function deliveryFee(
    string $area,
    int $km = 5,
    ?string $promoCode = null
): int {
    $base = match ($area) {
        'Bole', 'Kazanchis' => 4500,
        'Piassa' => 5500,
        default => 7000,
    };
    return $promoCode === 'ADDIS10'
        ? (int) round($base * 0.9)
        : $base;
}


function orderTotal(array $lines, string $area): array
{
    $subtotal = 0;
    foreach ($lines as $line) {
        $subtotal += $line['qty'] * $line['price'];
    }
    $fee = deliveryFee($area, $subtotal);
    return [
        'subtotal' => $subtotal,
        'fee' => $fee,
        'total' => $subtotal + $fee,
    ];
}