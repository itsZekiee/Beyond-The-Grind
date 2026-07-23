<?php

namespace App\Http\Controllers;

use App\Models\Cafe;
use App\Models\Comment;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * List all comments for a given cafe, newest first.
     * Public endpoint – no auth required.
     */
    public function index($cafeId)
    {
        $cafe = Cafe::findOrFail($cafeId);

        $comments = $cafe->comments()
            ->with('user:id,name,avatar')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($comment) {
                return [
                    'id'         => $comment->id,
                    'body'       => $comment->body,
                    'created_at' => $comment->created_at,
                    'user'       => [
                        'id'     => $comment->user->id,
                        'name'   => $comment->user->name,
                        'avatar' => $comment->user->avatar,
                    ],
                ];
            });

        return response()->json($comments);
    }

    /**
     * Store a new comment. Requires authentication.
     */
    public function store(Request $request, $cafeId)
    {
        $cafe = Cafe::findOrFail($cafeId);

        $validated = $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $comment = $cafe->comments()->create([
            'user_id' => $request->user()->id,
            'body'    => $validated['body'],
        ]);

        $comment->load('user:id,name,avatar');

        return response()->json([
            'id'         => $comment->id,
            'body'       => $comment->body,
            'created_at' => $comment->created_at,
            'user'       => [
                'id'     => $comment->user->id,
                'name'   => $comment->user->name,
                'avatar' => $comment->user->avatar,
            ],
        ], 201);
    }

    /**
     * Delete a comment. Only the comment owner may delete it.
     */
    public function destroy(Request $request, $commentId)
    {
        $comment = Comment::findOrFail($commentId);

        if ($comment->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted']);
    }
}
