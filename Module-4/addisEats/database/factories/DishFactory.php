<?php

namespace Database\Factories;

use App\Models\Dish;
use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Dish>
 */
class DishFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            
            'name' => fake()->randomElement([
                'Doro Wat',
                'Shiro',
                'Tibs',
                'Kitfo',
                'Misir Wat',
                'Gomen',
                'Firfir',
                'Chechebsa',
                'Beyaynetu',
                'Pasta',
                ]),
                
            'restaurant_id' => Restaurant::factory(),

            'price_in_santim' => fake()->numberBetween(
                15000,
                60000
            ),

            'is_fasting' => fake()->boolean(),

            'area' => fake()->randomElement([
                'Bole',
                'Piazza',
                'Kazanchis',
                'Mexico',
                'CMC',
            ]),
        ];
    }
}
