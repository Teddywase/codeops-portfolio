<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Domain\OrderStatus;

class Dish extends Model
{
    /** @use HasFactory<\Database\Factories\DishFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'restaurant',
        'price',
        'is_fasting',
        'area', 
    ];
    // PHP types on the way out, database types on the way in
    protected function casts(): array
    {
        return [
            'is_fasting' => 'boolean',
            'price' => 'integer',
            'status' => OrderStatus::class, // yesterday's enum
        ];
    }

}
