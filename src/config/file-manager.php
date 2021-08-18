<?php

return [
    'parents' => [
        // 'App\Models\Visit'
    ],
    'filter' => (function($query){
        // if(!admin()){
        //     return $query
        //         ->whereIn('parent_id', backpack_user()->visitsIds())
        //         ->where('parent_type', Visit::class);
        // }

        return $query;
    })
];
