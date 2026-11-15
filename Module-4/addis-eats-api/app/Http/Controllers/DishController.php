<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Dish;
use Illuminate\Http\Request;

class DishController extends Controller
{
    public function index()
    {
        return Dish::all();
    }

    public function store(Request $request)
    {
        $dish = Dish::create($request->all());
        return response()->json($dish, 201);
    }

    public function show(Dish $dish)
    {
        return $dish;
    }

    public function update(Request $request, Dish $dish)
    {
        $dish->update($request->all());
        return $dish;
    }

    public function destroy(Dish $dish)
    {
        $dish->delete();
        return response()->noContent();
    }
}