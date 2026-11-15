<?php
declare(strict_types=1);

namespace App\Providers;

use App\Domain\PricingRule;
use App\Domain\StandardRule;
use App\Domain\MenuService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(PricingRule::class, StandardRule::class);

        $this->app->bind(MenuService::class, function ($app) {
            // Fetch all dishes from the DB and map them to our Domain objects
            $dishes = \App\Models\Dish::all()->map(fn ($d) => new \App\Domain\Dish(
                name: $d->name,
                restaurant: $d->restaurant,
                price: $d->price,
                isFasting: $d->is_fasting
            ));
            
            return new MenuService($dishes);
        });
    }

    public function boot(): void
    {
        //
    }
}