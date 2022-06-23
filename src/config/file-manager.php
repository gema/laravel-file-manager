<?php

return [
    // Media parents
    'parents' => [
        // App\Models\Project::class,
    ],

    // Label for the parents field
    'parents_label' => 'Parents',

    // Parent field should appear or should be infer
    // You may use a closure to define the access to this
    'parents_field' => (function () {
        // return user()->hasManyProjects();
        return true;
    }),

    // Use to filter the parents list
    'parents_filter' => (function ($query) {
        // if(!admin()) {
        //     return $query->whereIn('id', backpack_user()->visitsIds());
        // }

        return $query;
    }),

    // File Manager listing filters
    'filter' => (function ($query) {
        // return $query
        //     ->where('parent_id', $project)
        //     ->where('parent_type', App\Models\Project::class);
        return $query;
    }),

    // Menu
    // You may use a closure to define the access on CRUD
    'access' => [
        'file-manager' => true,
        'media-tag' => true,
        'media-type' => true,
        'media-version' => true,
    ],

    // Disk where to save the medias, set false to use media cloud
    'disk' => false,

    // Temporary disk where to save the uploaded medias before sending them to media cloud
    'tmp_disk' => 'uploads',

    // Media cloud configuration
    'media_cloud' => [
        'key' => env('MEDIA_CLOUD_API_KEY', ''),
        'endpoint' => env('MEDIA_CLOUD_ENDPOINT', 'localhost/media-cloud'),
        'defaults' => env('MEDIA_CLOUD_DEFAULTS'),
        'path' => env('MEDIA_CLOUD_PATH', 'uploads'),
    ],
];
