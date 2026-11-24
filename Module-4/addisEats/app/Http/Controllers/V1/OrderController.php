<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function store(Request $request) {
        $request->validate([
            'area' => 'required|string',
            'delivery_fee_in_santim' => 'required|integer',
            'items' => 'required|array',
            'items.*.dish_id' => 'required|exists:dishes,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $total = 0;
        $orderLines = [];

        foreach ($request->items as $item) {
            $dish = \App\Models\Dish::find($item['dish_id']);
            $lineTotal = $dish->price_in_santim * $item['quantity'];
            $total += $lineTotal;

            $orderLines[] = [
                'dish_id' => $dish->id,
                'quantity' => $item['quantity'],
                'unit_price_in_santim' => $dish->price_in_santim,
            ];
        }

        $order = Order::create([
            'user_id' => $request->user()->id,
            'area' => $request->area,
            'delivery_fee_in_santim' => $request->delivery_fee_in_santim,
            'total_in_santim' => $total + $request->delivery_fee_in_santim,
            'status' => 'pending',
        ]);

        $order->lines()->createMany($orderLines);

        return response()->json($order->load('lines'), 201);
    }

    public function myOrders(Request $request) {
        return response()->json($request->user()->orders()->with('lines')->get());
    }
}