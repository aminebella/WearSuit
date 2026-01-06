<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\SuitImage;
use App\Models\Suit;

class SuitImageSeeder extends Seeder
{
    public function run(): void
    {
        $suits = Suit::all();
        
        if ($suits->isEmpty()) {
            $this->command->warn('No suits found. Please run SuitSeeder first.');
            return;
        }
        $imagePaths = [
            '\suit1.jpg', '\suit2.jpg', '\suit3.jpg', 
            '\suit4.jpg', '\suit5.jpg', '\suit6.jpg',
            '\suit7.jpg', '\suit8.jpg', '\suit9.jpg',
            '\suit10.jpg', '\suit11.jpg', '\suit12.jpg',
        ];
        $suitsFolderPath = public_path('suits');

        // Create images for each suit
        foreach ($suits as $suit) {
            $numImages = rand(2, 4); // 2-4 images per suit
            $selectedImages = (array) array_rand($imagePaths, $numImages);
            
            foreach ($selectedImages as $index => $imageIndex) {
                SuitImage::create([
                    'suit_id' => $suit->id,
                    'image_path' => $suitsFolderPath . $imagePaths[$imageIndex],
                    'sort_order' => $index,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Generate additional random suit images using factory
        SuitImage::factory(50)->create();
    }
}
