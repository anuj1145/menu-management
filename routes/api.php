<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MenuItemController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/menus', [MenuController::class, 'index']);
Route::get('/menus/{id}', [MenuController::class, 'show']);
Route::post('/menus', [MenuController::class, 'store']);

Route::get('/submenus', [MenuItemController::class, 'index']);
Route::post('/menu-items', [MenuItemController::class, 'store']);
Route::put('/menu-items/{id}', [MenuItemController::class, 'update']);
Route::delete('/menu-items/{id}', [MenuItemController::class, 'destroy']);

