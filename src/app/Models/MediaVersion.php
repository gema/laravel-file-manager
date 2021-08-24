<?php

namespace GemaDigital\FileManager\app\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;

class MediaVersion extends Model
{
    use CrudTrait;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'media_versions';
    protected $guarded = ['id'];
    protected $fillable = ['label'];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function mediaTypes()
    {
        return $this->belongsToMany(MediaType::class, 'media_type_has_versions', 'media_version_id', 'media_type_id');
    }
}
