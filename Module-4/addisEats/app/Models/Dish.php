<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
    protected $fillable = ['name', 'restaurant_id', 'price_in_santim', 'is_fasting', 'area'];
    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}
