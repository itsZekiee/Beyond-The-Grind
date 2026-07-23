<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $fillable = [
        'visitor_id',
        'ip_address',
        'user_agent',
        'visited_on',
    ];

    protected $casts = [
        'visited_on' => 'date',
    ];
}
