<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;
use GemaDigital\FileManager\app\Http\Requests\MediaVersionRequest;
use \GemaDigital\FileManager\app\Models\MediaVersion;

/**
 * Class MediaVersionCrudController.
 *
 * @property \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class MediaVersionCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\InlineCreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;
    use Traits\Access;

    public function setup()
    {
        CRUD::setModel(MediaVersion::class);
        CRUD::setRoute(config('backpack.base.route_prefix') . '/media-version');
        CRUD::setEntityNameStrings(ucfirst(__('file-manager::messages.media_version')), ucfirst(__('file-manager::messages.media_versions')));

        // Access
        $this->hasAccess('media-version') || abort(401);
    }

    protected function setupListOperation()
    {
        CRUD::addColumn([
            'name' => 'label',
            'label' => ucFirst(__('file-manager::messages.name')),
        ]);
    }

    protected function setupCreateOperation()
    {
        CRUD::setValidation(MediaVersionRequest::class);

        CRUD::addField([
            'name' => 'label',
            'label' => ucFirst(__('file-manager::messages.name')),
        ]);

    }

    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }
}
