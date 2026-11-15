<?php

namespace Database\Factories;

use App\Models\Dish;
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
            'name'       => fake()->randomElement([
                'Doro Wat', 'Shiro', 'Kitfo', 'Tibs', 'Firfir', 'Misir Wat', 'Gomen', 'Atkilt'
            ]),
            'restaurant' => fake()->randomElement([
                'Yod Abyssinia', 'Kategna', 'Sishu', 'Habesha Kitchen', 'Bole Vegan'
            ]),
            'price'      => fake()->numberBetween(10000, 60000),
            'is_fasting' => fake()->boolean(),
            'area'       => fake()->randomElement(config('addiseats.zones')),
        ];
    }
}
