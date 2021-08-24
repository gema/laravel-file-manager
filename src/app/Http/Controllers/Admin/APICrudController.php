<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

use GemaDigital\FileManager\app\Models\MediaTag;
use GemaDigital\FileManager\app\Models\MediaType;
use GemaDigital\Framework\app\Http\Controllers\Admin\APICrudController as BaseAPICrudController;

class APICrudController extends BaseAPICrudController
{
    public function mediaTagSearch()
    {
        return $this->entitySearch(MediaTag::class, ['name']);
    }

    public function mediaTypeSearch()
    {
        return $this->entitySearch(MediaType::class, ['type']);
    }
}
