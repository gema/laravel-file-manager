<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;


use GemaDigital\FileManager\app\Models\Media;
use GemaDigital\FileManager\app\Models\MediaContent;
use GemaDigital\FileManager\app\Models\MediaTag;
use GemaDigital\FileManager\app\Models\MediaType;

use App\Models\Visit; // Needs review! (config file?)

class APICrudController extends \GemaDigital\Framework\app\Http\Controllers\Admin\APICrudController
{
    public function mediaTagSearch()
    {
        return $this->entitySearch(MediaTag::class, ['name']);
    }

    public function MediaTypeSearch(){
        return $this->entitySearch(MediaType::class, ['type']);
    }
}
