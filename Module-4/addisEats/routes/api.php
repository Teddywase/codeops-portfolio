<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DishController;
use App\Http\Controllers\Api\OrderController;



Route::prefix('v1')->group(function () {

    Route::apiResource('dishes', DishController::class);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/dishes', [DishController::class, 'index']);


Route::middleware('auth:sanctum')->group(function () {
    Route::post('/dishes', [DishController::class, 'store']); 
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
});