<?php

namespace GemaDigital\FileManager\app\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use CrudTrait;
    use HasFactory;
    use Traits\FilterByParentTrait;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'medias';
    protected $guarded = ['id'];
    protected $fillable = ['parent_id', 'parent_type', 'type_id'];
    public $appends = ['combinations'];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function mediaContent()
    {
        return $this->hasOne(MediaContent::class);
    }

    public function combinatedMedias()
    {
        return $this->belongsToMany(Media::class, 'media_has_combinations', 'media_id', 'combinated_media_id');
    }

    public function getCombinationsAttribute()
    {
        return $this->combinatedMedias()->get();
    }
}
