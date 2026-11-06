<?php

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'adis-eats-api',
        'time' => now()->toIso8601String(),
        ]);
    });

Route::get('/areas', function (){
    return response()->json([
        'Bole','Kazanchis','Piassa','Megenagna'
    ]);
});

Route::get('/quote', function(){
    $lines = [
        ['item' => 'Doro Wat', 'qty' => 2, 'price' => 500.00],
        ['item' => 'Tibs', 'qty' => 1, 'price' => 300.00],
        ['item' => 'Shiro', 'qty' => 3, 'price' => 180.00],
    ];

    $area = 'Bole';

    $result = orderTotal($lines, $area);

    return response()->json([
        'area'     => $area,
        'lines'    => $lines,
        'subtotal' => $result['subtotal'],
        'fee'      => $result['fee'],
        'total'    => $result['total'],
    ]);
});