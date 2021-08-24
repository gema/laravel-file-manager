<?php

namespace GemaDigital\FileManager\app\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;

class MediaContent extends Model
{
    use CrudTrait;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'media_content';
    protected $guarded = ['id'];
    protected $fillable = ['uuid', 'media_id', 'title', 'description', 'state', 'content', 'preview'];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function tags()
    {
        return $this->belongsToMany(MediaTag::class, 'media_has_tags', 'media_id', 'tag_id');
    }

    public function media()
    {
        return $this->hasOne(Media::class);
    }
}
