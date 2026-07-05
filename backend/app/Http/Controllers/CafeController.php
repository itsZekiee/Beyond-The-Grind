<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class CafeController extends Controller
{
    public function index(Request $request)
    {
        $query = Cafe::query();

        // Only published for public listing unless explicitly overridden
        if ($request->boolean('all') !== true) {
            $query->published();
        }

        // Simple search by title or name, and optional location
        if ($search = $request->query('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'LIKE', "%{$search}%")
                  ->orWhere('name', 'LIKE', "%{$search}%");
            });
        }

        if ($location = $request->query('location')) {
            $query->where('location', 'LIKE', "%{$location}%");
        }

        if ($request->has('featured')) {
            $query->where('is_featured', $request->boolean('featured'));
        }

        if ($sort = $request->query('sort')) {
            if ($sort === 'popular') {
                $query->orderByDesc('views')->orderByDesc('likes');
            } elseif ($sort === 'latest') {
                $query->orderByDesc('created_at');
            }
        } else {
            $query->orderByDesc('created_at');
        }

        if ($limit = $request->query('limit')) {
            $query->limit((int)$limit);
        }

        return response()->json($query->get())
            ->header('Cache-Control', 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
    }

    public function store(Request $request)
    {
        try {
            if ($request->has('content') && !$request->has('review')) {
                $request->merge(['review' => $request->input('content')]);
            }

            $validated = $request->validate([
                'title' => 'nullable|string|max:255',
                'name' => 'nullable|string|max:255',
                'type' => 'nullable|string|in:Cafe,Restaurant,Landmark',
                'location' => 'nullable|string|max:255',
                'rating' => 'nullable|numeric|min:0|max:5',
                'review' => 'required|string',
                'is_published' => 'sometimes',
                'is_featured' => 'sometimes',
                'tags' => 'nullable|array',
                'tags.*' => 'string',
                'images' => 'nullable|array',
                'images.*' => 'image|max:5120',
                'image' => 'nullable|image|max:5120',
            ]);

            if ($request->has('is_published')) {
                $validated['is_published'] = filter_var($request->is_published, FILTER_VALIDATE_BOOLEAN);
            }
            if ($request->has('is_featured')) {
                $validated['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);
            }

            if ($request->hasFile('image')) {
                $path = $request->file('image')->store('public/images');
                $validated['image_path'] = Storage::url($path);
            }

            $imagesPaths = [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('public/images');
                    $imagesPaths[] = Storage::url($path);
                }
            }
            if (!empty($imagesPaths)) {
                $validated['images'] = $imagesPaths;
                if (!isset($validated['image_path']) && count($imagesPaths) > 0) {
                    $validated['image_path'] = $imagesPaths[0]; // Set the first image as the cover
                }
            }

            if (isset($validated['tags']) && is_array($validated['tags'])) {
                // Ensure unique and trimmed tags
                $validated['tags'] = array_values(array_unique(array_map(function ($t) {
                    return trim($t);
                }, $validated['tags'])));
            }

            $cafe = Cafe::create($validated);

            return response()->json($cafe, 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Cafe creation failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json([
                'message' => 'Internal server error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $cafe = Cafe::where('id', $id)->firstOrFail();
        return response()->json($cafe);
    }

    public function update(Request $request, $id)
    {
        try {
            $cafe = Cafe::findOrFail($id);

            if ($request->has('content') && !$request->has('review')) {
                $request->merge(['review' => $request->input('content')]);
            }

            $validated = $request->validate([
                'title' => 'nullable|string|max:255',
                'name' => 'nullable|string|max:255',
                'type' => 'nullable|string|in:Cafe,Restaurant,Landmark',
                'location' => 'nullable|string|max:255',
                'rating' => 'nullable|numeric|min:0|max:5',
                'review' => 'required|string',
                'is_published' => 'sometimes',
                'is_featured' => 'sometimes',
                'tags' => 'nullable|array',
                'tags.*' => 'string',
                'images' => 'nullable|array',
                'images.*' => 'image|max:5120',
                'image' => 'nullable|image|max:5120',
            ]);

            // Map '1'/'0' strings to boolean for the database
            if ($request->has('is_published')) {
                $validated['is_published'] = filter_var($request->is_published, FILTER_VALIDATE_BOOLEAN);
            }
            if ($request->has('is_featured')) {
                $validated['is_featured'] = filter_var($request->is_featured, FILTER_VALIDATE_BOOLEAN);
            }

            if ($request->hasFile('image')) {
                if ($cafe->image_path) {
                    $oldPath = str_replace('/storage/', 'public/', $cafe->image_path);
                    Storage::delete($oldPath);
                }
                $path = $request->file('image')->store('public/images');
                $validated['image_path'] = Storage::url($path);
            }

            $imagesPaths = $cafe->images ?: [];
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $image) {
                    $path = $image->store('public/images');
                    $imagesPaths[] = Storage::url($path);
                }
                $validated['images'] = $imagesPaths;
                if (!isset($validated['image_path']) && count($imagesPaths) > 0) {
                    $validated['image_path'] = $imagesPaths[0];
                }
            }

            if (isset($validated['tags']) && is_array($validated['tags'])) {
                $validated['tags'] = array_values(array_unique(array_map(function ($t) {
                    return trim($t);
                }, $validated['tags'])));
            }

            $cafe->update($validated);

            return response()->json($cafe);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Cafe update failed: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);
            return response()->json([
                'message' => 'Internal server error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $cafe = Cafe::findOrFail($id);
        $cafe->delete();
        return response()->json(['message' => 'Deleted successfully']);
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

    public function recordView($id)
    {
        $cafe = Cafe::findOrFail($id);
        $cafe->increment('views');
        return response()->json(['views' => $cafe->views]);
    }
}
