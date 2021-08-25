<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin\Traits;

use DB;

trait Access
{
    public static function hasAccess($entry)
    {
        $access = config("file-manager.access.$entry");

        if (is_bool($access)) {
            return $access;
        }

        if ($access instanceof \Closure) {
            return call_user_func_array($access, []);
        }
    }

    public static function hasNoAccess($entry)
    {
        return !self::hasAccess($entry);
    }
}
