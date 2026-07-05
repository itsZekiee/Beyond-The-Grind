<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cafe extends Model
{
    protected $fillable = [
        'title',
        'name',
        'type',
        'location',
        'rating',
        'review',
        'image_path',
        'images',
        'likes',
        'views',
        'is_published',
        'is_featured',
        'tags',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'is_featured' => 'boolean',
        'tags' => 'array',
        'images' => 'array',
        'rating' => 'float',
        'likes' => 'integer',
        'views' => 'integer',
    ];

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}
