<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CafeController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\RatingController;
use App\Http\Controllers\VisitorController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// ─── Authentication ────────────────────────────────────────────────────────────
Route::post('/register',     [AuthController::class, 'register']);
Route::post('/login',        [AuthController::class, 'login']);
Route::post('/auth/google',  [AuthController::class, 'googleSignIn']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);
});

// ─── Visitor Analytics ─────────────────────────────────────────────────────────
// GET  /api/visitors/count  – read current total (no side-effects)
// POST /api/visitors/track  – record a distinct visit (deduped per visitor/day)
Route::get('/visitors/count',  [VisitorController::class, 'index']);
Route::post('/visitors/track', [VisitorController::class, 'track']);
// Legacy alias: returns count without side-effects
Route::get('/visitors', [VisitorController::class, 'index']);

// ─── Cafes (public) ───────────────────────────────────────────────────────────
Route::get('/cafes',            [CafeController::class, 'index']);
Route::get('/cafes/{id}',       [CafeController::class, 'show']);
Route::post('/cafes',           [CafeController::class, 'store']);
Route::put('/cafes/{id}',       [CafeController::class, 'update']);
Route::delete('/cafes/{id}',    [CafeController::class, 'destroy']);
Route::post('/cafes/{id}/view', [CafeController::class, 'recordView']);

// ─── Cafes (authenticated actions) ───────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cafes/{id}/like',   [CafeController::class, 'like']);
    Route::post('/cafes/{id}/unlike', [CafeController::class, 'unlike']);
});

// ─── Comments ─────────────────────────────────────────────────────────────────
// Public: list comments for an article
Route::get('/cafes/{id}/comments', [CommentController::class, 'index']);

// Auth-gated: post or delete a comment
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cafes/{id}/comments',        [CommentController::class, 'store']);
    Route::delete('/comments/{commentId}',     [CommentController::class, 'destroy']);
});

// ─── Ratings ──────────────────────────────────────────────────────────────────
// Public: summary (avg, count). Optionally enriched with myRating when auth token
// is present – we accept the token but do not require it.
Route::get('/cafes/{id}/ratings/summary', [RatingController::class, 'summary']);

// Auth-gated: submit / update a rating
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cafes/{id}/ratings', [RatingController::class, 'store']);
});

// ─── Debug / System ──────────────────────────────────────────────────────────
Route::get('/debug-db', function () {
    return response()->json([
        'columns' => \Illuminate\Support\Facades\Schema::getColumnListing('cafes'),
    ]);
});

Route::get('/migrate', function () {
    try {
        $exitCode = \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $output   = \Illuminate\Support\Facades\Artisan::output();
        return response()->json([
            'message'   => $exitCode === 0 ? 'Migration successful' : 'Migration failed',
            'exit_code' => $exitCode,
            'output'    => $output,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString(),
        ], 500);
    }
});
