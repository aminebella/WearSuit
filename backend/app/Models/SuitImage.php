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

    protected $casts = [
        'sort_order' => 'integer'
    ];

    public function suit()
    {
        return $this->belongsTo(Suit::class);
    }

    // Get the main image (where sort_order = 0)
    public function scopeMain($query)
    {
        return $query->where('sort_order', 0);
    }
    // Get secondary images (where sort_order > 0)
    public function scopeSecondary($query)
    {
        return $query->where('sort_order', '>', 0);
    }
    // Set as main image
    public function setAsMain()
    {
        // Get current main image if exists
        $currentMain = $this->suit->images()->where('sort_order', 0)->first();
        
        if ($currentMain) {
            // Swap sort orders
            $currentMain->update(['sort_order' => $this->sort_order]);
        }
        
        // Set this one as main (sort_order = 0)
        $this->update(['sort_order' => 0]);
        
        return $this;
    }
}
