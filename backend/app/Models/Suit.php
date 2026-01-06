<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Suit extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id', // Shop owner
        'name',
        'description',
        'size',
        'color',
        'gender',
        'category',
        'price_per_day',
        'status', // available, unavailable
        'is_active' // Soft delete alternative
    ];
    
    protected $casts = [
        'price_per_day' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relationships
    // suit images
    public function images()
    {
        return $this->hasMany(SuitImage::class);
    }

    // suit rentals
    public function rentals()
    {
        return $this->hasMany(Rental::class);
    }
    
    // suit admin
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }
}
