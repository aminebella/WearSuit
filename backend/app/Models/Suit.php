<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suit extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'size',
        'color',
        'gender',
        'category',
        'price_per_day',
        'status'
    ];

    public function images()
    {
        return $this->hasMany(SuitImage::class);
    }

    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }
}
