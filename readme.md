# FileManager

[![Latest Version on Packagist][ico-version]][link-packagist]
[![Total Downloads][ico-downloads]][link-downloads]
[![Build Status][ico-travis]][link-travis]
[![StyleCI][ico-styleci]][link-styleci]

This is where your description should go. Take a look at [contributing.md](contributing.md) to see a to do list.

## Installation

Via Composer

``` bash
$ composer require gemadigital/file-manager
```

## Usage

### Running migrations

``` bash
$ php artisan migrate
```

### Publishing the config

``` bash
$ php artisan vendor:publish --provider="GemaDigital/FileManager/FileManagerServiceProvider"
```

### Sample config file

``` php
<?php

use App\Models\Visit;

return [
    'parents' => [
        Visit::class, // Parent classes namespaces (multiple parents supported)
    ],
    'filter' => (function($query){
        /**
        * Function used in medias fetch operation.
        * Use to apply filters, ordering, etc to the file-manager medias listing
        */
        if(!admin()){
            return $query
                ->whereIn('parent_id', backpack_user()->visitsIds())
                ->where('parent_type', Visit::class);
        }

        return $query;
    })
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
use GemaDigital\Framework\app\Models\Model; // Or an extension of this class

class MyEntity extends Model {
  use MediaTrait; // Use the trait
  protected static $mediable = ['images', 'videos'] // Define which columns will have medias
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

## Change log

Please see the [changelog](changelog.md) for more information on what has changed recently.

## Testing

``` bash
$ composer test
```

## Contributing

Please see [contributing.md](contributing.md) for details and a todolist.

## Security

If you discover any security related issues, please email author@email.com instead of using the issue tracker.

## Credits

- [Author Name][link-author]
- [All Contributors][link-contributors]

## License

MIT. Please see the [license file](license.md) for more information.

[ico-version]: https://img.shields.io/packagist/v/gemadigital/file-manager.svg?style=flat-square
[ico-downloads]: https://img.shields.io/packagist/dt/gemadigital/file-manager.svg?style=flat-square
[ico-travis]: https://img.shields.io/travis/gemadigital/file-manager/master.svg?style=flat-square
[ico-styleci]: https://styleci.io/repos/12345678/shield

[link-packagist]: https://packagist.org/packages/gemadigital/file-manager
[link-downloads]: https://packagist.org/packages/gemadigital/file-manager
[link-travis]: https://travis-ci.org/gemadigital/file-manager
[link-styleci]: https://styleci.io/repos/12345678
[link-author]: https://github.com/gemadigital
[link-contributors]: ../../contributors
