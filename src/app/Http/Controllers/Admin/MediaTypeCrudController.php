<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use Config;
use GemaDigital\FileManager\app\Http\Requests\MediaTypeRequest;
use \GemaDigital\FileManager\app\Models\MediaType;

/**
 * Class MediaTypeCrudController.
 *
 * @property \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class MediaTypeCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\FetchOperation;
    use Traits\Access;

    public function setup()
    {
        CRUD::setModel(MediaType::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/media-type');
        CRUD::setEntityNameStrings(ucfirst(__('file-manager::messages.media_type')), ucfirst(__('file-manager::messages.media_types')));

        // Access
        $this->hasAccess('media-type') || abort(401);
    }

    protected function setupListOperation()
    {
        CRUD::addColumn([
            'name' => 'name',
            'label' => ucFirst(__('file-manager::messages.name')),
        ]);

        CRUD::addColumn([
            'type' => 'array',
            'name' => 'extensions',
            'label' => 'Allowed Extensions',
        ]);

        CRUD::addColumn([
            'type' => 'relationship',
            'name' => 'combinableTypes',
            'label' => 'Combinable Media Types',
        ]);
    }

    protected function setupCreateOperation()
    {
        CRUD::setValidation(MediaTypeRequest::class);

        CRUD::addField([
            'name' => 'name',
            'label' => ucFirst(__('file-manager::messages.name')),
        ]);

        CRUD::addField([
            'name' => 'key',
            'label' => ucFirst(__('file-manager::messages.key')),
        ]);

        CRUD::addField([
            'type' => 'relationship',
            'name' => 'mediaVersions',
            'label' => 'Media Versions',
            'ajax' => true,
            'inline_create' => ['entity' => 'media-version'],
        ]);

        CRUD::addField([
            'type' => 'relationship',
            'name' => 'combinableTypes',
            'label' => 'Combinable Media Types',
        ]);

        CRUD::addField([
            'type' => 'select2_from_array',
            'name' => 'extensions',
            'label' => 'Allowed extensions',
            'options' => Config::get('file-manager.allowed_extensions'),
            'allows_null' => false,
            'allows_multiple' => true,
        ]);
    }

    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }

    public function fetchMediaVersions()
    {
        return $this->fetch(\GemaDigital\FileManager\app\Models\MediaVersion::class);
    }
}
