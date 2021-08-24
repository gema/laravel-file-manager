<?php

namespace GemaDigital\FileManager\app\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    use CrudTrait;
    use Traits\FilterByParentTrait;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'medias';
    protected $guarded = ['id'];
    protected $fillable = ['parent_id', 'parent_type', 'type_id'];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */
    public function mediaContent()
    {
        return $this->hasOne(MediaContent::class);
    }
}
