<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = ['user_id', 'area', 'delivery_fee_in_santim', 'total_in_santim', 'status'];
    public function lines()
    {
        return $this->hasMany(OrderLine::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
