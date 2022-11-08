<?php

namespace GemaDigital\FileManager\app\Models;

use Backpack\CRUD\app\Models\Traits\CrudTrait;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MediaType extends Model
{
    use CrudTrait;
    use HasFactory;

    /*
    |--------------------------------------------------------------------------
    | GLOBAL VARIABLES
    |--------------------------------------------------------------------------
    */

    protected $table = 'media_types';
    protected $guarded = ['id'];
    protected $fillable = ['key', 'name', 'extensions', 'extra_fields'];
    protected $casts = [
        'extensions' => 'array',
        'extra_fields' => 'array',
    ];

    /*
    |--------------------------------------------------------------------------
    | RELATIONS
    |--------------------------------------------------------------------------
    */

    public function mediaVersions()
    {
        return $this->belongsToMany(MediaVersion::class, 'media_type_has_versions', 'media_type_id', 'media_version_id');
    }

    public function combinableTypes()
    {
        return $this->belongsToMany(MediaType::class, 'media_types_has_combinations', 'media_type_id', 'combinated_media_type_id');
    }
}
