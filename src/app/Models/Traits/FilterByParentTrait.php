<?php

namespace GemaDigital\FileManager\app\Models\Traits;

use Illuminate\Database\Eloquent\Builder;

trait FilterByParentTrait
{
    protected static function bootFilterByParentTrait()
    {
        static::addGlobalScope('filterByUserVisits', function (Builder $builder) {
            $builder = call_user_func_array(config('file-manager.filter'), [$builder]);
        });
    }
}
