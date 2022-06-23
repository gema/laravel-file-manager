<?php

namespace GemaDigital\FileManager\app\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait FilterParentsTrait
{
    protected static function bootFilterParentsTrait()
    {
        static::addGlobalScope('filterParents', function (Builder $builder) {
            $builder = call_user_func_array(config('file-manager.parents_filter'), [$builder]);
        });
    }
}
