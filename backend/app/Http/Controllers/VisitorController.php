<?php

namespace App\Http\Controllers;

use App\Models\Visit;
use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VisitorController extends Controller
{
    /**
     * Return the current total visitor count without mutating it.
     */
    public function index()
    {
        return response()->json(['count' => $this->currentCount()]);
    }

    /**
     * Record a distinct visit and return the total count.
     *
     * A visit is counted at most once per visitor per calendar day. The
     * visitor is identified by a client-supplied persistent id, falling back
     * to the request IP. The global counter is only incremented when a new
     * (visitor, day) row is actually inserted, keeping the total precise even
     * under SSR/hydration double-fires or repeated page loads.
     */
    public function track(Request $request)
    {
        $visitorId = $request->input('visitor_id') ?: $request->ip();
        $today = now()->toDateString();

        $count = DB::transaction(function () use ($visitorId, $request, $today) {
            // firstOrCreate on the (visitor_id, visited_on) unique key. If the
            // row already existed today, wasRecentlyCreated is false and we do
            // NOT increment the counter.
            $visit = Visit::firstOrCreate(
                ['visitor_id' => $visitorId, 'visited_on' => $today],
                ['ip_address' => $request->ip(), 'user_agent' => $request->userAgent()]
            );

            $visitor = Visitor::lockForUpdate()->first();
            if (!$visitor) {
                $visitor = Visitor::create(['count' => 0]);
            }

            if ($visit->wasRecentlyCreated) {
                $visitor->increment('count');
            }

            return $visitor->count;
        });

        return response()->json(['count' => $count]);
    }

    private function currentCount(): int
    {
        $visitor = Visitor::first();
        if (!$visitor) {
            $visitor = Visitor::create(['count' => 0]);
        }
        return (int) $visitor->count;
    }
}
