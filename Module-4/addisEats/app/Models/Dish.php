<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dish extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'restaurant_id', 'price_in_santim', 'is_fasting', 'area'];
    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }

    protected function casts(): array
    {
        return [
            'restaurant_id'   => 'integer',
            'price_in_santim' => 'integer',
            'is_fasting'      => 'boolean',
        ];
    }
}
