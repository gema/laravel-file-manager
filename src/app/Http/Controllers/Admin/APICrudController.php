<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;


use GemaDigital\FileManager\app\Models\Media;
use GemaDigital\FileManager\app\Models\MediaContent;
use GemaDigital\FileManager\app\Models\MediaTag;
use GemaDigital\FileManager\app\Models\MediaType;

use App\Models\Visit; // Needs review! (config file?)

class APICrudController extends \GemaDigital\Framework\app\Http\Controllers\Admin\APICrudController
{
    /*
    |--------------------------------------------------------------------------
    | Medias
    |--------------------------------------------------------------------------
    */
    public function parentSearch(){
        if(!admin()){
            $visitsIds = backpack_user()->visitsIds();
            $visits = Visit::whereIn('id', $visitsIds)->get()->pluck('name' , 'id');
            return json_response($visits);
        }else{
            return json_response(Visit::get()->pluck('name', 'id'));
        }
    }

    public function mediaSearch($type = null, $tags = null){
        $mediasIds = null;
        $query = Media::with('mediaContent');

        if($tags !== null){
            $tags = explode('-', $tags);

            $mediaTags = \DB::table('media_has_tags')
                ->select(\DB::raw('count(media_id) as total, media_id'))
                ->whereIn('tag_id', $tags)
                ->groupBy('media_id');

            $mediaIds = \DB::table(\DB::raw("({$mediaTags->toSql()}) as media"))
                ->mergeBindings($mediaTags)
                ->select('media_id')
                ->where('total', count($tags))
                ->pluck('media_id');

            $query->whereIn('id', $mediaIds);
        }

        if($type !== null && $type !== "0"){
            $query->where('type_id', $type);
        }

        if(!admin()){
            $query->whereIn('parent_id', backpack_user()->visitsIds());
        }
        
        return $query->paginate(15);
    }

    public function mediaCustomSearch($ids)
    {
        $ids = explode('-', $ids);
        $whereIn = [
            'id' => $ids
        ];

        return $this->entitySearch(MediaCustom::class, ['title'], null, $whereIn);
    }

    public function mediaTagSearch()
    {
        return $this->entitySearch(MediaTag::class, ['name']);
    }

    public function MediaTypeSearch(){
        return $this->entitySearch(MediaType::class, ['type']);
    }
}
