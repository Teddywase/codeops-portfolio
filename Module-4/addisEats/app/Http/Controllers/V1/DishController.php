<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\DishResource;
use App\Models\Dish;
use Illuminate\Http\Request;

class DishController extends Controller
{
    public function index(Request $request) {
        $query = Dish::with('restaurant');

        if ($request->has('fasting')) {
            $query->where('is_fasting', $request->boolean('fasting'));
        }
        if ($request->has('area')) {
            $query->where('area', $request->area);
        }

        $dishes = $query->paginate(10);

        return DishResource::collection($dishes);
    }

    public function store(Request $request) {
        $validated = $request->validate([
            'name' => 'required|string',
            'restaurant_id' => 'required|exists:restaurants,id',
            'price_in_santim' => 'required|integer',
            'is_fasting' => 'boolean',
            'area' => 'required|string',
        ]);

        $dish = Dish::create($validated);
        return response()->json($dish, 201);
    }
}