<?php

namespace GemaDigital\FileManager;

use Illuminate\Support\ServiceProvider;

class FileManagerServiceProvider extends ServiceProvider
{
    /**
     * Perform post-registration booting of services.
     */
    public function boot(): void
    {
        $this->loadTranslationsFrom(__DIR__ . '/resources/lang', 'file-manager');
        $this->loadViewsFrom(__DIR__ . '/resources/views', 'file-manager');
        $this->loadMigrationsFrom(__DIR__ . '/database/migrations');
        $this->loadRoutesFrom(__DIR__ . '/routes/routes.php');

        // Publishing is only necessary when using the CLI.
        if ($this->app->runningInConsole()) {
            $this->bootForConsole();
        }
    }

    /**
     * Register any package services.
     */
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/config/file-manager.php', 'file-manager');

        // Register the service the package provides.
        $this->app->singleton('file-manager', function ($app) {
            return new FileManager();
        });
    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides()
    {
        return ['file-manager'];
    }

    /**
     * Console-specific booting.
     */
    protected function bootForConsole(): void
    {
        // Publishing the configuration file.
        $this->publishes([
            __DIR__ . '/config/file-manager.php' => config_path('file-manager.php'),
        ], 'file-manager.config');

        $this->publishes([__DIR__ . '/public' => public_path()], 'public');

        // Publishing the views.
        /*$this->publishes([
            __DIR__.'/../resources/views' => base_path('resources/views/vendor/gemadigital'),
        ], 'file-manager.views');*/

        // Publishing assets.
        /*$this->publishes([
            __DIR__.'/../resources/assets' => public_path('vendor/gemadigital'),
        ], 'file-manager.views');*/

        // Publishing the translation files.
        /*$this->publishes([
            __DIR__.'/../resources/lang' => resource_path('lang/vendor/gemadigital'),
        ], 'file-manager.views');*/

        // Registering package commands.
        // $this->commands([]);
    }
}
