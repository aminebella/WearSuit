<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rental extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'suit_id',
        'start_date',
        'end_date',
        'return_date',
        'status',
        'notes',
        'total_price',
        'payment_status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function suit()
    {
        return $this->belongsTo(Suit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
