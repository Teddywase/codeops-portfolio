<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Restaurant;
use App\Models\Dish;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        Restaurant::factory()->count(5)->create();

        Restaurant::all()->each(function ($restaurant) {
            Dish::factory(5)->create([
                'restaurant_id' => $restaurant->id,
                'area' => $restaurant->area,
            ]);
        });


    }
}
