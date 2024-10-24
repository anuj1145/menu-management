<?php


namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    // Fetch all menu items
    public function index()
    {
        return response()->json(MenuItem::with('menu')->get(), 200);
    }

    // Store a new menu item
    public function store(Request $request)
{
    $request->validate([
        'title' => 'required|string|max:255',
        'menu_id' => 'required|exists:menus,id',
        'parent_id' => 'nullable|exists:menu_items,id', // Ensure parent_id references an existing menu item or is null
    ]);

    // If parent_id is provided, calculate the depth
    $depth = 0;
    if ($request->parent_id) {
        $parentItem = MenuItem::find($request->parent_id);
        $depth = $parentItem->depth + 1; // Set depth to one level deeper than the parent
    }

    // Create the new menu item
    $menuItem = MenuItem::create([
        'title' => $request->title,
        'menu_id' => $request->menu_id,
        'parent_id' => $request->parent_id, // It can be null if not provided
        'depth' => $depth, // Assign the calculated depth
    ]);

    return response()->json($menuItem, 201);
}


    // Fetch a specific menu item by ID
    public function show($id)
    {
        $menuItem = MenuItem::with('menu')->findOrFail($id);
        return response()->json($menuItem, 200);
    }

    // Update a specific menu item by ID
    public function update(Request $request, $id)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'menu_id' => 'sometimes|required|exists:menus,id',
            'depth' => 'sometimes|required|integer',
        ]);

        $menuItem = MenuItem::findOrFail($id);
        $menuItem->update($request->all());

        return response()->json($menuItem, 200);
    }

    // Delete a specific menu item by ID
    public function destroy(Request $request, $id)
    {
        $menuItem = MenuItem::findOrFail($id);
    
        // Check if the item exists
        if (!$menuItem) {
            return response()->json(['error' => 'Menu item not found.'], 404);
        }
    
        // Check for children (not necessary for "IT" but good for other items)
        if ($menuItem->children()->count() > 0) {
            return response()->json(['error' => 'Cannot delete menu item with children.'], 403);
        }
    
        // Delete the menu item
        $menuItem->delete();
    
        return response()->json(null, 204);
    }
    
}
