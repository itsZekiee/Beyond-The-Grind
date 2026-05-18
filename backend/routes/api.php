<?php

use App\Http\Controllers\CafeController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/debug-db', function () {
    return response()->json([
        'columns' => \Illuminate\Support\Facades\Schema::getColumnListing('cafes'),
    ]);
});

Route::get('/migrate', function () {
    try {
        $exitCode = \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $output = \Illuminate\Support\Facades\Artisan::output();
        return response()->json([
            'message' => $exitCode === 0 ? 'Migration successful' : 'Migration failed',
            'exit_code' => $exitCode,
            'output' => $output
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

Route::get('/cafes', [CafeController::class, 'index']);
Route::get('/cafes/{id}', [CafeController::class, 'show']);
Route::post('/cafes', [CafeController::class, 'store']);
Route::put('/cafes/{id}', [CafeController::class, 'update']);
Route::delete('/cafes/{id}', [CafeController::class, 'destroy']);
Route::post('/cafes/{id}/like', [CafeController::class, 'like']);
Route::post('/cafes/{id}/unlike', [CafeController::class, 'unlike']);
Route::post('/cafes/{id}/view', [CafeController::class, 'recordView']);

Route::get('/visitors', function () {
    $visitor = \App\Models\Visitor::first();
    if (!$visitor) {
        $visitor = \App\Models\Visitor::create(['count' => 0]);
    }
    $visitor->increment('count');
    return response()->json(['count' => $visitor->count]);
});
