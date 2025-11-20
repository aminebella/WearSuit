<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuitImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'suit_id',
        'image_path',
        'sort_order',
    ];

    public function suit()
    {
        return $this->belongsTo(Suit::class);
    }
}
