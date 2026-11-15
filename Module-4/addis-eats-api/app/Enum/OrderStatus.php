<?php

namespace App\Enum;

enum OrderStatus: string
{
    case Placed = 'placed';
    case Preparing = 'preparing';
    case OnTheWay = 'on_the_way';
    case Delivered = 'delivered';

    public function label(): string
    {
        return match ($this){
            self::Placed => 'placed',
            self::Preparing => 'Being prepared',
            self::OnTheWay => 'On the way',
            self::Delivered => 'Delivered',
        };
    }

}
