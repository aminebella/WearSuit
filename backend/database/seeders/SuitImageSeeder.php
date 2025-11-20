<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\SuitImage;

class SuitImageSeeder extends Seeder
{
    public function run(): void
    {
        $path_asstes= "C:/Users/Admin/Documents/DevWork/EMSI/4thYear/DevMobile/Project/Devloppement/earSuit/backend/public/assets/";
        $images = [
            'suit1.jpeg', 'suit2.jpeg', 'suit3.jpeg', 
            'suit4.jpeg', 'suit5.jpeg', 'suit6.jpeg', 
            'suit7.jpeg', 'suit8.jpeg', 'suit9.jpeg', 
            'suit10.jpeg', 'suit11.jpeg', 'suit12.jpeg', 
            'suit13.jpeg', 'suit14.jpeg', 'suit15.jpeg', 
            'suit16.jpeg', 'suit17.jpeg', 'suit18.jpeg', 
            'suit19.jpeg', 'suit20.jpeg', 'suit21.jpeg', 
            'suit22.jpeg', 'suit23.jpeg', 'suit24.jpeg', 
            'suit25.jpeg', 'suit26.jpeg', 'suit27.jpeg', 
            'suit28.jpeg', 'suit29.jpeg', 'suit30.jpeg', 
        ];

        SuitImage::create([
            'suit_id' => 1,
            'image_path' => $path_asstes."/".$images[0],
            'sort_order' => 0,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $min = 0;
        $max = 3;
        for ($suit = 1; $suit <= 10; $suit++) {    
            for ($img = $min; $img < $max; $img++) {
                SuitImage::create([
                    'suit_id' => $suit,
                    'image_path' => $path_asstes.$images[$img], // dossier storage/app/public/suits
                    'sort_order' => $img,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            $min = $max;
            $max += 3; 
        }

        // Factory
        // SuitImage::factory(10)->create();
        
    }
}
