<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use Illuminate\Http\Request;

class CafeController extends Controller
{
    public function index()
    {
        return response()->json(Cafe::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'location' => 'required|string',
            'rating' => 'required|numeric',
            'review' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $cafe = Cafe::create($validated);

        return response()->json($cafe, 201);
    }

    public function like($id)
    {
        $cafe = Cafe::findOrFail($id);
        $cafe->increment('likes');
        return response()->json(['likes' => $cafe->likes]);
    }

    public function unlike($id)
    {
        $cafe = Cafe::findOrFail($id);
        if ($cafe->likes > 0) {
            $cafe->decrement('likes');
        }
        return response()->json(['likes' => $cafe->likes]);
    }
}
