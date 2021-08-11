<?php

// Framework
Route::group(
    [
        'namespace' => 'GemaDigital\FileManager\app\Http\Controllers',
        'middleware' => 'web',
    ],
    function () {
        // Admin
        Route::group(
            [
                'prefix' => config('backpack.base.route_prefix'),
                'middleware' => ['admin', 'web'],
                'namespace' => 'Admin',
            ],
            function () {
                // TODO
            });
    });

// Webhooks
Route::group(
    [
        'namespace' => 'GemaDigital\FileManager\app\Http\Controllers',
    ],
    function () {
        // TODO
    });
