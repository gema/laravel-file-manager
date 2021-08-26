<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use GemaDigital\FileManager\app\Http\Requests\MediaTagRequest;
use \GemaDigital\FileManager\app\Models\MediaTag;

/**
 * Class MediaTagCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class MediaTagCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use Traits\Access;

    public function setup()
    {
        CRUD::setModel(MediaTag::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/media-tag');
        CRUD::setEntityNameStrings(ucfirst(__('file-manager::messages.media_tag')), ucfirst(__('file-manager::messages.media_tags')));

        // Access
        $this->hasAccess('media-tag') || abort(401);
    }

    protected function setupListOperation()
    {
        CRUD::addColumn([
            'name' => 'name',
            'label' => ucFirst(__('file-manager::messages.name')),
        ]);

        CRUD::addColumn([
            'name' => 'parent_id',
            'label' => ucfirst(__('file-manager::messages.parent')),
        ]);

        CRUD::addColumn([
            'name' => 'parent_type',
            'label' => ucfirst(__('file-manager::messages.parent_type')),
        ]);
    }

    protected function setupCreateOperation()
    {
        CRUD::setValidation(MediaTagRequest::class);

        CRUD::addField([
            'name' => 'name',
            'label' => ucFirst(__('file-manager::messages.name')),
        ]);

        CRUD::addField([
            'name' => 'parent_id',
            'label' => ucFirst(__('parent')),
            'type' => 'select2-morph',
            'view_namespace' => 'file-manager::field',
            'url' => '/api/media/parent',
        ]);

        CRUD::addField([
            'name' => 'parent_type',
            'type' => 'text',
            'wrapperAttributes' => [
                'class' => 'parent-type-field d-none',
            ],
        ]);
    }

    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }
}
