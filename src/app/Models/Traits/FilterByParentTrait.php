<?php

namespace GemaDigital\FileManager\app\Models\Traits;

use App\Models\Contact;
use App\Models\EndUser;
use App\Models\Visit;
use App\User;
use App\Models\MediaTag;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;
use Modules\Quiz\Entities\Quiz;
use Modules\Store\Entities\StoreContact;

trait FilterByParentTrait
{
    protected static function bootFilterByParentTrait()
    {
        static::addGlobalScope('filterByUserVisits', function (Builder $builder) {
            $builder = call_user_func_array(config("file-manager.filter"), [$builder]);
        });
    }
}
