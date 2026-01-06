<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'admin_id',
        'user_id',
        'suit_id',
        'status',
        'notes',
        'total_price',
        'payment_status',
    ];
    
    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    // Relationships
    // Rental suit
    public function suit()
    {
        return $this->belongsTo(Suit::class);
    }

    // Rental client (user)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    
    // Rental admin (user)
    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
    
    // Rental day rental
    public function days()
    {
        return $this->hasMany(RentalDay::class);
    }
    
    // Scopes
    
    public function scopeForClient($query, $userId)
    {
        return $query->where('user_id', $userId);
    }
    
    public function scopeForAdmin($query, $adminId)
    {
        return $query->where('admin_id', $adminId);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
