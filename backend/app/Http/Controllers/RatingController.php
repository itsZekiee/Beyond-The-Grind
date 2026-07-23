<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use App\Models\Rating;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * Return the average rating, total count, and the authenticated user's
     * own rating (if any) for a given cafe.
     * Public endpoint – no auth required.
     */
    public function summary(Request $request, $cafeId)
    {
        $cafe = Cafe::findOrFail($cafeId);

        $avg   = round((float) $cafe->ratings()->avg('value'), 1);
        $count = $cafe->ratings()->count();

        // Attempt to resolve the authenticated user via Sanctum without
        // enforcing auth (the route is public but tokens are accepted).
        $user     = auth('sanctum')->user();
        $myRating = null;
        if ($user) {
            $mine     = $cafe->ratings()->where('user_id', $user->id)->first();
            $myRating = $mine ? (int) $mine->value : null;
        }

        return response()->json([
            'avg'      => $avg,
            'count'    => $count,
            'myRating' => $myRating,
        ]);
    }

    /**
     * Submit (or update) the authenticated user's rating for a cafe.
     * One rating per user per cafe – subsequent submissions update the row.
     */
    public function store(Request $request, $cafeId)
    {
        $cafe = Cafe::findOrFail($cafeId);

        $validated = $request->validate([
            'value' => 'required|integer|min:1|max:5',
        ]);

        $rating = Rating::updateOrCreate(
            ['cafe_id' => $cafe->id, 'user_id' => $request->user()->id],
            ['value'   => $validated['value']]
        );

        // Recompute the stored aggregate rating on the cafe row
        $newAvg = round((float) $cafe->ratings()->avg('value'), 1);
        $cafe->update(['rating' => $newAvg]);

        return response()->json([
            'avg'      => $newAvg,
            'count'    => $cafe->ratings()->count(),
            'myRating' => (int) $rating->value,
        ]);
    }
}
