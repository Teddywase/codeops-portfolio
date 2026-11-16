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

    public function store(Request $dish)
    {

        $dish = Dish::create([
            'name' => 'Doro Wat',
            'restaurant' => 'Yod Abyssinia',
            'price' => 45000,
            'is_fasting' => false,
            'area' => 'Bole',
        ]);

        $dish = Dish::create([
            'name' => 'Kitfo',
            'restaurant' => 'Yod Abyssinia',
            'price' => 52000,
            'is_fasting' => false,
            'area' => 'Bole',
        ]);

        $dish = Dish::create([
            'name' => 'Shiro',
            'restaurant' => 'Habesha Kitchen',
            'price' => 18000,
            'is_fasting' => true,
            'area' => 'Kazanchis',
        ]);

        $dish = Dish::create([
            'name' => 'Tibs',
            'restaurant' => 'Habesha Kitchen',
            'price' => 48000,
            'is_fasting' => false,
            'area' => 'Kazanchis',
        ]);

        $dish = Dish::create([
            'name' => 'Beyaynetu',
            'restaurant' => 'Bole Vegan',
            'price' => 22000,
            'is_fasting' => true,
            'area' => 'Piassa',
        ]);

        $dish = Dish::create([
            'name' => 'Misir Wat',
            'restaurant' => 'Bole Vegan',
            'price' => 15000,
            'is_fasting' => true,
            'area' => 'Piassa',
        ]);

        $dish = Dish::create([
            'name' => 'Pasta Bolognese',
            'restaurant' => 'Piassa Pizzeria',
            'price' => 32000,
            'is_fasting' => false,
            'area' => 'Piassa',
        ]);

        $dish = Dish::create([
            'name' => 'Pizza Margherita',
            'restaurant' => 'Piassa Pizzeria',
            'price' => 38000,
            'is_fasting' => true,
            'area' => 'Piassa',
        ]);

        $dish = Dish::create([
            'name' => 'Lasagna',
            'restaurant' => 'Piassa Pizzeria',
            'price' => 35000,
            'is_fasting' => false,
            'area' => 'Megenagna',
        ]);


        $dish = Dish::create([
            'name' => 'Beef Burger',
            'restaurant' => 'Sishu',
            'price' => 28000,
            'is_fasting' => false,
            'area' => 'Megenagna',
        ]);

        $dish = Dish::create([
            'name' => 'Chicken Sandwich',
            'restaurant' => 'Sishu',
            'price' => 25000,
            'is_fasting' => false,
            'area' => 'Megenagna',
        ]);

        $dish = Dish::create([
            'name' => 'Fasting Platter',
            'restaurant' => 'Sishu',
            'price' => 20000,
            'is_fasting' => true,
            'area' => 'Megenagna',
        ]);

        $dish = Dish::create([
            'name' => 'Firfir',
            'restaurant' => 'Kategna',
            'price' => 18000,
            'is_fasting' => false,
            'area' => 'Kazanchis',
        ]);

        $dish = Dish::create([
            'name' => 'Chechebsa',
            'restaurant' => 'Kategna',
            'price' => 14000,
            'is_fasting' => false,
            'area' => 'Kazanchis',
        ]);

        $dish = Dish::create([
            'name' => 'Egg Sandwich',
            'restaurant' => 'Kategna',
            'price' => 10000,
            'is_fasting' => false,
            'area' => 'Bole',
        ]);

        $dish = Dish::create([
            'name' => 'Avocado Juice',
            'restaurant' => 'Kategna',
            'price' => 8000,
            'is_fasting' => true,
            'area' => 'Bole',
        ]);

        return response()->json([
            'message' => 'Dish created successfully',
            'data'=> $dish,
        ], 201);
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