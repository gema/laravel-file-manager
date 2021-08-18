<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

use GemaDigital\FileManager\app\Http\Requests\MediaTagRequest;
use Backpack\CRUD\app\Http\Controllers\CrudController;
use Backpack\CRUD\app\Library\CrudPanel\CrudPanelFacade as CRUD;

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
    use \Backpack\CRUD\app\Http\Controllers\Operations\ShowOperation;

    /**
     * Configure the CrudPanel object. Apply settings to all operations.
     * 
     * @return void
     */
    public function setup()
    {
        $this->crud->setModel(\GemaDigital\FileManager\app\Models\MediaTag::class);
        $this->crud->setRoute(config('backpack.base.route_prefix') . '/media-tag');
        $this->crud->setEntityNameStrings(ucfirst(__("file-manager::messages.media_tag")), ucfirst(__("file-manager::messages.media_tags")));
    }

    /**
     * Define what happens when the List operation is loaded.
     * 
     * @see  https://backpackforlaravel.com/docs/crud-operation-list-entries
     * @return void
     */
    protected function setupListOperation()
    {
        $this->crud->column('name');

        if(admin()){
            $this->crud->addColumn([
                'type' => 'relationship',
                'name' => 'parent',
                'label' => ucfirst(__('parent'))
            ]);
        }
       

        /**
         * Columns can be defined using the fluent syntax or array syntax:
         * - $this->crud->column('price')->type('number');
         * - $this->crud->addColumn(['name' => 'price', 'type' => 'number']); 
         */
    }

    /**
     * Define what happens when the Create operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-create
     * @return void
     */
    protected function setupCreateOperation()
    {
        $this->crud->setValidation(MediaTagRequest::class);

        $this->crud->field('name');
        
        foreach(config('file-manager.parents') as $parent){
            $this->crud->addField([
                'type' => 'relationship',
                'name' => 'parent_id',
                'entity' => 'parent',
                'model' => $parent,
                'label' => ucfirst(__('parent'))
            ]);
        }
    }

    /**
     * Define what happens when the Update operation is loaded.
     * 
     * @see https://backpackforlaravel.com/docs/crud-operation-update
     * @return void
     */
    protected function setupUpdateOperation()
    {
        $this->setupCreateOperation();
    }
}
