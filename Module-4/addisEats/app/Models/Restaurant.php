<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = ['name', 'area', 'phone', 'opening_hours'];
    public function dishes()
    {
        return $this->hasMany(Dish::class);
    }
}
