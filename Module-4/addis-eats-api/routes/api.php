<?php

// use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Domain\Dish;
use App\Domain\MenuService;
use App\Exceptions\OutsideZoneException;
use Illuminate\Support\Collection;

require_once __DIR__ . '/../app/Support/Pricing.php'; // Modify according to actual path

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
        ['item' => 'Doro Wat', 'qty' => 2, 'price' => 500],
        ['item' => 'Tibs', 'qty' => 1, 'price' => 300],
        ['item' => 'Shiro', 'qty' => 3, 'price' => 180],
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

Route::get('/menu', function () {
    $area   = request('area', 'Bole');
    $budget = (int) request('budget', 25000);

    $dishes = collect(json_decode(file_get_contents(base_path('dishes.json')), true))
        ->map(fn (array $row) => new Dish(
            name: $row['name'],
            restaurant: $row['restaurant'],
            price: $row['price'],
            isFasting: $row['isFasting'],
        ));

    try {
        return (new MenuService($dishes))->affordableIn($area, $budget);
    } catch (OutsideZoneException $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'area'  => $e->area,
        ], 422);
    }
});