<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use Symfony\Component\HttpFoundation\Request;

/**
 * Class MediaVersionCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class MediaCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\FetchOperation;

    protected function fetchMedia()
    {
        return $this->fetch([
            'model' => 'GemaDigital\FileManager\app\Models\Media',
            'paginate' => config('file-manager.rows'),
            'query' => function ($model) {
                $model = $model->with('mediaContent');

                $tags = request()->tags;
                if ($tags !== null) {
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

                if ($type !== null && $type !== '0') {
                    $model = $model->where('type_id', $type);
                }

                $ids = request()->medias;

                if ($ids !== null) {
                    $model = $model->whereIn('id', explode(',', $ids));
                }

                $model = call_user_func_array(config('file-manager.filter'), [$model]);

                return $model;
            },
            'searchable_attributes' => [],
        ]);
    }

    protected function fetchGlobalData(Request $request)
    {
        $global = false;
        $parentId = false;
        $parentNamespace = false;
        $show = admin() ?: call_user_func(config('file-manager.parents_field'));

        if (!$show && !admin()) {
            $parentQuery = call_user_func(config('file-manager.parents_query'));
            $parentId = $parentQuery->first()->id;
            $parentNamespace = get_class($parentQuery->getModel());
        }

        return json_response([
            'tags' => $this->fetchTags(),
            'types' => $this->fetchTypes(),
            'parent' => [
                'label' => config('file-manager.parents_label'),
                'show' => $show,
                'id' => $parentId,
                'model' => $parentNamespace,
                'global' => $global,
            ],
        ]);
    }

    protected function fetchTags()
    {
        return $this->fetch([
            'model' => 'GemaDigital\FileManager\app\Models\MediaTag',
            'paginate' => 10,
        ]);
    }

    protected function fetchTypes()
    {
        return $this->fetch([
            'model' => 'GemaDigital\FileManager\app\Models\MediaType',
            'paginate' => 20,
        ]);
    }

    public function fetchParents()
    {
        $data = [];
        foreach (config('file-manager.parents') as $class) {
            $object = new $class();
            $result = $object->paginate(10);

            $data[$class] = $result;
        }

        return json_response($data);
    }
}
