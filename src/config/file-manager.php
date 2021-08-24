<?php

return [
    // Media parents
    'parents' => [
        // App\Models\Project::class
    ],

    // File Manager listing filters
    'filter' => (function ($query) {
        // return $query
        //     ->where('parent_id', $project)
        //     ->where('parent_type', App\Models\Project::class);
        return $query;
    }),
];
