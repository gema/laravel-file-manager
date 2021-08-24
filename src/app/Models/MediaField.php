<?php

namespace GemaDigital\FileManager\app\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;

class MediaField extends Model
{
    use CrudTrait;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'media_fields';
    protected $guarded = ['id'];
    protected $fillable = ['entity_type', 'entity_id'];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function medias()
    {
        return $this->belongsToMany(Media::class, 'media_field_has_media', 'media_field_id', 'media_id');
    }
}
