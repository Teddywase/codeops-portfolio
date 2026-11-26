<?php

namespace Database\Factories;

use App\Models\Restaurant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Restaurant>
 */
class RestaurantFactory extends Factory
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
                'Katega', 'Habehsa Kitchen', 'Mesob Habesha', 'Yod Abssinia', 'Lucy Kitchen'
            ]),

            'area' => fake()->randomElement([
                'Bole',
                'Piazza',
                'Kazanchis',
                'Mexico',
                'CMC',
            ]),

            'phone' => fake()->numerify('09########'),

            'opening_hours' => '08:00-22:00',
        ];
    }
}
