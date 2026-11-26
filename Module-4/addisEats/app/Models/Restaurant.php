<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'area', 'phone', 'opening_hours'];
    public function dishes()
    {
        return $this->hasMany(Dish::class);
    }
    protected function casts(): array
    {
        return [
            'name' => 'string',
            'area' => 'string',
            'phone' => 'string',
            'opening_hours' => 'string'
        ];
    }

}