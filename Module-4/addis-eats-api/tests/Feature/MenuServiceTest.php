<?php
declare(strict_types=1);

use App\Domain\Dish;
use App\Domain\MenuService;
use App\Exceptions\OutsideZoneException;
use Illuminate\Support\Collection;

function menuFixture(): Collection
{
    return collect([
        new Dish('Doro Wat', 'Habesha Kitchen', 42000, false),
        new Dish('Shiro',    'Habesha Kitchen', 18000, true),
        new Dish('Tibs',     'Habesha Kitchen', 50000, false),
        new Dish('Misir Wat','Bole Vegan',      15000, true),
        new Dish('Gomen',    'Bole Vegan',      12000, true),
    ]);
}

it('returns affordable dishes sorted by price', function () {
    $result = (new MenuService(menuFixture()))->affordableIn('Bole', 20000);

    expect($result)->toHaveCount(3)
        ->and($result->pluck('name')->all())->toBe(['Gomen', 'Misir Wat', 'Shiro']);
});

it('formats prices as ETB strings', function () {
    $result = (new MenuService(menuFixture()))->affordableIn('Bole', 20000);
    expect($result->first()['price'])->toBe('120.00 ETB');
});

it('renumbers keys after filter', function () {
    $result = (new MenuService(menuFixture()))->affordableIn('Bole', 20000);
    expect($result->keys()->all())->toBe([0, 1, 2]);
});

it('throws for an area outside the zone', function () {
    (new MenuService(menuFixture()))->affordableIn('Hawassa', 20000);
})->throws(OutsideZoneException::class, 'Addis Eats does not deliver to Hawassa yet.');

it('carries the offending area on the exception', function () {
    try {
        (new MenuService(menuFixture()))->affordableIn('Hawassa', 20000);
    } catch (OutsideZoneException $e) {
        expect($e->area)->toBe('Hawassa');
    }
});

it('accepts every zone in the ZONES constant', function () {
    foreach (['Bole', 'Kazanchis', 'Piassa', 'Megenagna'] as $zone) {
        expect(fn () => (new MenuService(menuFixture()))->affordableIn($zone, 100000))
            ->not->toThrow(OutsideZoneException::class);
    }
});