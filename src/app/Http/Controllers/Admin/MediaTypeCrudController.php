<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

use GemaDigital\FileManager\app\Http\Requests\MediaTypeRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

/**
 * Class MediaTypeCrudController
 * @package App\Http\Controllers\Admin
 * @property-read \Backpack\CRUD\app\Library\CrudPanel\CrudPanel $crud
 */
class MediaTypeCrudController extends CrudController
{
    use \Backpack\CRUD\app\Http\Controllers\Operations\ListOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\CreateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\UpdateOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\DeleteOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;
    use \Backpack\CRUD\app\Http\Controllers\Operations\FetchOperation;

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        $this->crud->setModel(\GemaDigital\FileManager\app\Models\MediaType::class);
        $this->crud->setRoute(config('backpack.base.route_prefix') . '/media-type');
        $this->crud->setEntityNameStrings(ucfirst(__("file-manager::messages.media_type")), ucfirst(__("file-manager::messages.media_types")));
    }

    protected function setupListOperation()
    {
        $this->crud->column('name');
        $this->crud->addColumn([
            'type' => 'relationship',
            'name' => 'mediaVersions',
            'label' => 'Media Versions'
        ]);
    }

    protected function setupCreateOperation()
    {
        $this->crud->setValidation(MediaTypeRequest::class);

        $this->crud->field('name');
        $this->crud->field('key');
        $this->crud->addField([
            'type' => 'relationship',
            'name' => 'mediaVersions',
            'label' => 'Media Versions',
            'ajax' => true,
            'inline_create' => [ 'entity' => 'media-version' ]
        ]);

        
    }

    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }

    public function fetchMediaVersion()
    {
        return $this->fetch(\GemaDigital\FileManager\app\Models\MediaVersion::class);
    }
}
