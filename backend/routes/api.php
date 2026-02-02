<?php

use App\Http\Controllers\CafeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/cafes', [CafeController::class, 'index']);
Route::post('/cafes', [CafeController::class, 'store']);
Route::post('/cafes/{id}/like', [CafeController::class, 'like']);
Route::post('/cafes/{id}/unlike', [CafeController::class, 'unlike']);
