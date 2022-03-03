<?php

namespace GemaDigital\FileManager\app\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Str;

class MediaTag extends Model
{
    use CrudTrait;
    use HasFactory;
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

    /*
    |--------------------------------------------------------------------------
    | ACCESSORS
    |--------------------------------------------------------------------------
    */

    public function getParentAttribute()
    {
        return (new $this->parent_type())->where('id', $this->parent_id)->first() ?? null;
    }

    public function getParentLabelAttribute()
    {
        return ($this->parent->{$this->parent->identifiableAttribute()} ?? '') . ' (' . (Str::of($this->parent_type)->afterLast('\\') ?? '') . ')';
    }
}
