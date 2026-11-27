<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DishResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=> $this->id,
            'Name'=> $this->name,
            'Price_etb' => number_format($this->price_in_santim / 100,2,) . 'ETB',
            'Fasting' => $this->is_fasting,
            'Area' => $this->area,
        ];
    }
}