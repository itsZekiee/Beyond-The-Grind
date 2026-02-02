<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cafe extends Model
{
    protected $fillable = [
        'name',
        'location',
        'rating',
        'review',
        'image_path',
        'latitude',
        'longitude',
        'likes',
    ];
}
