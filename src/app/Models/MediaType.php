<?php

namespace GemaDigital\FileManager\app\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaType extends Model
{
    use \Backpack\CRUD\app\Models\Traits\CrudTrait;
    use HasFactory;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'media_types';
    protected $fillable = ['key', 'name'];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function mediaVersions()
    {
        return $this->belongsToMany('GemaDigital\FileManager\app\Models\MediaVersion', 'media_type_has_versions', 'media_type_id', 'media_version_id');
    }
}