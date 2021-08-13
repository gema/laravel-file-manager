<?php

use App\Models\Visit;

return [
    'parents' => [
        Visit::class,
    ],
    'filter' => (function($query){

        // Sample for xplora

        // if(admin()){
        //     return $query
        //         ->whereIn('parent_id', backpack_user()->visitsIds())
        //         ->where('parent_type', Visit::class);
        // }

        return $query;
    })
];
