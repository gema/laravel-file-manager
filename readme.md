# FileManager

[![Latest Version on Packagist][ico-version]][link-packagist]
[![Total Downloads][ico-downloads]][link-downloads]
[![Build Status][ico-travis]][link-travis]

This is where your description should go. Take a look at [contributing.md](contributing.md) to see a to do list.

## Installation

Via Composer

``` bash
composer require gemadigital/file-manager
```

## Usage

### Running migrations

``` bash
php artisan migrate
```

### Publishing the config

``` bash
php artisan vendor:publish --provider="GemaDigital\FileManager\FileManagerServiceProvider"
```

### Sample config file

``` php
<?php

use App\Models\Project;

return [
    'parents' => [
        Project::class, // Parent classes namespaces (multiple parents supported)
    ],
    
    // Parent field should appear or should be infer
    // You may use a closure to define the access to this
    'parents_field' => (function () {
        // return user()->hasManyProjects();
        return true;
    }),
    
    // Use to filter the parents list
    // You may use a closure to define the access to this
    'parents_filter' => (function ($query){
        if(!admin()) {
            return $query->whereIn('id', user()->parentsIds());
        }
        return $query;
    }),
    
    'filter' => (function($query){
        /**
        * Function used in medias fetch operation.
        * Use to apply filters, ordering, etc to the file-manager medias listing
        */
        if(!admin()){
            return $query
                ->whereIn('parent_id', backpack_user()->projects())
                ->where('parent_type', Project::class);
        }

        return $query;
    })
    
    // Menu
    // You may use a closure to define the access on CRUD
    'access' => [
        'file-manager' => true,
        'media-tag' => true,
        'media-type' => true,
        'media-version' => true,
    ],

    // Use media cloud or use Laravel Storage
    // Set as false to use media cloud, set a diskname to use Laravel Storage
    'disk' => false,
];
```

### Adding File-Manager to the sidebar menu
**`sidebar_content.blade.php`**
``` blade
@include('file-manager::sidebar_content')
```

### Using File-Manager as a field (associated to an entity)
**`MyEntity.php`**
``` php
<?php

use GemaDigital\FileManager\app\Models\Traits\MediaTrait;
use GemaDigital\Framework\app\Models\Model;

class MyEntity extends Model {
  use MediaTrait; // Use the trait

  protected static $mediable = ['images', 'videos']; // Define which columns will have medias
}
```

**`MyEntityCrudController.php`**
``` php
<?php

class MyEntityCrudController extends CrudController {
  public function setupCreateOperation(){
  
    // Setting up the fields
    
    $this->crud->addField([
        'name' => 'images',
        'type' => 'file-manager',
        'view_namespace' => 'file-manager::field',
        'media_type' => 1 // Get this from `media_types.id`
    ]);

    $this->crud->addField([
        'name' => 'videos',
        'type' => 'file-manager',
        'view_namespace' => 'file-manager::field',
        'media_type' => 2 // Get this from `media_types.id`
    ]);
  }
}
```
### Using File-Manager as a Vuejs Component

#### Install dependencies for Vue.js
File-manager uses [select2](https://select2.org/), but this cannot be installed on the fly, so you will need to do it manually, the easiest way is to include their CDN in your HTML:

**`index.html`**
```html
<link href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" rel="stylesheet" />
```

```html
<script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
```

**`MyComponent.vue`**
```vue

<template>
<div>
<FileManager 
  name="fieldName"
  mediaType="1"
  min="1"
  max="1"
  triggerClasses="btn btn-primary"
  @save="onSave"
>
  <!-- Trigger Template (sample) -->
  <template v-slot:trigger>
    My trigger
  </template>

  <!-- Selected Media Template (sample) -->
  <template v-slot:selectedMedia="slot">
    <!-- slot property holds all the data from the media -->
    <img class="w-100" :src="slot.media.media_content.preview"/>
  </template>
</FileManager>
</div>
</template>

<script>
// Import FileManager component
import FileManager from "../../../../vendor/gemadigital/file-manager/src/resources/js/vue/FileManager.vue";

export default {
  components:{
    FileManager,
  },
  methods: {
    // Define what happens when medias are selected
    onSave(selectedMedias){
      console.log('Do something with' , {selectedMedias});
    }
  },
};
</script>

```

## Change log

Please see the [changelog](changelog.md) for more information on what has changed recently.

## Testing

``` bash
composer test
```

## Contributing

Please see [contributing.md](contributing.md) for details and a todolist.

## Security

If you discover any security related issues, please email author@email.com instead of using the issue tracker.

## License

MIT. Please see the [license file](license.md) for more information.

[ico-version]: https://img.shields.io/packagist/v/gemadigital/file-manager.svg?style=flat-square
[ico-downloads]: https://img.shields.io/packagist/dt/gemadigital/file-manager.svg?style=flat-square
[ico-travis]: https://img.shields.io/travis/gemadigital/file-manager/master.svg?style=flat-square

[link-packagist]: https://packagist.org/packages/gemadigital/file-manager
[link-downloads]: https://packagist.org/packages/gemadigital/file-manager
[link-travis]: https://travis-ci.org/gemadigital/file-manager
