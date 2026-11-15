<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AreasController extends Controller
{
    public function text()
    {
        $menu = [
            ['name' => 'Doro Wat', 'price' => 42000],
            ['name' => 'Shiro', 'price' => 18000],
        ];

        return $names = array_map(fn($id) => $d ['name'], $menu);
    }
}
