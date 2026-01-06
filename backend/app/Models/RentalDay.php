<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RentalDay extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_id',
        'day',
    ];

    protected $casts = [
        'day' => 'date:Y-m-d'  // Ensure proper date format
    ];

    // Relationships
    public function rental()
    {
        return $this->belongsTo(Rental::class);
    }
    
    // Scopes
    public function scopeForDate($query, $date)
    {
        return $query->where('day', $date);
    }

    public function scopeBetweenDates($query, $startDate, $endDate)
    {
        return $query->whereBetween('day', [$startDate, $endDate]);
    }
}
