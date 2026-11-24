<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderLine extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * These match the columns in your migration.
     */
    protected $fillable = [
        'order_id',
        'dish_id',
        'quantity',
        'unit_price_in_santim',
    ];

    /**
     * Get the order that this line belongs to.
     */
    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    /**
     * Get the actual dish details for this line.
     */
    public function dish()
    {
        return $this->belongsTo(Dish::class);
    }

    /**
     * Optional: A helper function to calculate the total for just this line.
     * (Quantity * Unit Price)
     */
    public function getLineTotalAttribute()
    {
        return $this->quantity * $this->unit_price_in_santim;
    }
}