<?php

namespace GemaDigital\FileManager\Facades;

use Illuminate\Support\Facades\Facade;

class FileManager extends Facade
{
    /**
     * Get the registered name of the component.
     */
    protected static function getFacadeAccessor(): string
    {
        return 'file-manager';
    }
}
