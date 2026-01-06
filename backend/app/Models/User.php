<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'shop_name',
        'city',
        'address',
        'phone',
        'email',
        'password',
        'role'
    ];
    
    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'password',
    ];

    // Relationships
    // Client's rentals
    public function clientRentals()
    {
        return $this->hasMany(Rental::class, 'user_id');
    }

    // Admin's rentals (rentals they've created)
    public function managedRentals()
    {
        return $this->hasMany(Rental::class, 'admin_id');
    }
    
    // Admin's suits (suits they've created)
    public function suits()
    {
        return $this->hasMany(Suit::class, 'admin_id');
    }
    
    // Helper methods
    public function isAdmin()
    {
        return $this->role === 'admin';
    }

    public function isClient(): bool
    {
        return $this->role === 'user';
    }
}
