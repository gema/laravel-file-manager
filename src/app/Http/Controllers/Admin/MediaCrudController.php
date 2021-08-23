<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class MediaVersionCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class MediaCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\FetchOperation;

    protected function fetchParent(){
        $data = [];
        foreach(config("file-manager.parents") as $class){
            $response = $this->fetch([
                'model' => $class,
                'query' => function($model) {
                    return $model;
                },
                'searchable_attributes' => []
            ]);

            $data[$class] = $response;
        }

        return json_response($data);
    }

    protected function fetchMedia(){
        return $this->fetch([
            'model' => 'GemaDigital\FileManager\app\Models\Media',
            'paginate' => 15,
            'query' => function($model) {
                $model = $model->with('mediaContent');

                $tags = request()->tags;
                if($tags !== null){
                    $mediaTags = \DB::table('media_has_tags')
                        ->select(\DB::raw('count(media_id) as total, media_id'))
                        ->whereIn('tag_id', $tags)
                        ->groupBy('media_id');

                    $mediaIds = \DB::table(\DB::raw("({$mediaTags->toSql()}) as media"))
                        ->mergeBindings($mediaTags)
                        ->select('media_id')
                        ->where('total', count($tags))
                        ->pluck('media_id');

                    $model = $model->whereIn('id', $mediaIds);
                }

                $type = request()->type;

                if($type !== null && $type !== "0"){
                    $model = $model->where('type_id', $type);
                }

                $model = call_user_func_array(config("file-manager.filter"), [$model]);
    
                return $model;
            },
            'searchable_attributes' => []
        ]);
    }
}