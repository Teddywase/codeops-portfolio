<?php

use App\Http\Controllers\V1\RestaurantController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\DishController;


// Route::get('/test-db', function () {
//     try {
//         $tables = DB::select('SHOW TABLES');

//         return response()->json([
//             'success' => true,
//             'message' => 'Database connected successfully',
//             'tables' => $tables
//         ], 200);
//     } catch (\Exception $e) {

//         return response()->json([
//             'success' => false,
//             'message' => $e->getMessage()
//         ], 500);
//     }
// });

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'adisEats',
        'time' => now()->toIso8601String(),
    ]);
});


Route::prefix('v1')->group(function () {

    Route::controller(DishController::class)->group(function () {
        Route::get('/dishes', 'index');
        Route::post('/dishes', 'store');
    });

    Route::controller(RestaurantController::class)->group(function () {
        Route::get('/restaurants', 'index');
        Route::post('/restaurants', 'store');
        Route::get('/restaurants/{id}', 'show');
        Route::put('/restaurants/{restaurant}', 'update');
    });

});



// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::get('/dishes', [DishController::class, 'index']);


// Route::middleware('auth:sanctum')->group(function () {
//     Route::post('/dishes', [DishController::class, 'store']);
//     Route::post('/orders', [OrderController::class, 'store']);
//     Route::get('/my-orders', [OrderController::class, 'myOrders']);
// });