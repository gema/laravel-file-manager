<?php

return [
    // Media parents
    'parents' => [
        // App\Models\Project::class,
    ],

    // TODO
    // Parent field should appear or should be infer
    // You may use a closure to define the access to this
    'parents_field' => (function () {
        // return user()->hasManyProjects();
        return true;
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
];
