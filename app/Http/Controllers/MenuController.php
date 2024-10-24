<?php
namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;

class MenuController extends Controller
{
    // Fetch all menus
    public function index()
    {
        return response()->json(Menu::all(), 200);
    }

    // Store a new menu
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $menu = Menu::create($request->all());

        return response()->json($menu, 201);
    }

    // Fetch a specific menu by ID
    public function show($id)
    {
        $menu = Menu::findOrFail($id);
        return response()->json($menu, 200);
    }
}
