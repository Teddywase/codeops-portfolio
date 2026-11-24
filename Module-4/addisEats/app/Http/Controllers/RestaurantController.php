<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;

class RestaurantController extends Controller
{
    /**
     * GET /api/restaurants
     * List all restaurants (with an option to include their dishes)
     */
    public function index()
    {
        // 'with('dishes')' solves the "with its dishes as a relationship" requirement.
        // Eager loading this prevents N+1 query problems.
        $restaurants = Restaurant::with('dishes')->paginate(10);

        return response()->json($restaurants);
    }

    /**
     * POST /api/restaurants
     * Create a new restaurant (Admin feature)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'area' => 'required|string',
            'phone' => 'required|string',
            'opening_hours' => 'required|string',
        ]);

        $restaurant = Restaurant::create($validated);

        return response()->json([
            'message' => 'Restaurant created successfully',
            'data' => $restaurant
        ], 201);
    }

    /**
     * GET /api/restaurants/{id}
     * Show a single restaurant and its dishes
     */
    public function show($id)
    {
        $restaurant = Restaurant::with('dishes')->find($id);

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }

        return response()->json($restaurant);
    }

    /**
     * PUT/PATCH /api/restaurants/{id}
     * Update an existing restaurant
     */
    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'area' => 'sometimes|string',
            'phone' => 'sometimes|string',
            'opening_hours' => 'sometimes|string',
        ]);

        $restaurant->update($validated);

        return response()->json([
            'message' => 'Restaurant updated successfully',
            'data' => $restaurant
        ]);
    }

    /**
     * DELETE /api/restaurants/{id}
     * Delete a restaurant
     */
    public function destroy($id)
    {
        $restaurant = Restaurant::find($id);

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }

        // Because we set cascadeOnDelete() in the migrations, 
        // deleting the restaurant will automatically delete its dishes!
        $restaurant->delete();

        return response()->json(['message' => 'Restaurant deleted successfully']);
    }
}
