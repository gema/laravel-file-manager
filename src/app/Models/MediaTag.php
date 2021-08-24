<?php

namespace GemaDigital\FileManager\app\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;

class MediaTag extends Model
{
    use CrudTrait;
    use Traits\FilterByParentTrait;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'media_tags';
    protected $guarded = ['id'];
    protected $fillable = ['name', 'parent_id', 'parent_type'];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function medias()
    {
        return $this->belongsToMany(Media::class, 'media_has_tags', 'tag_id', 'media_id');
    }
}
