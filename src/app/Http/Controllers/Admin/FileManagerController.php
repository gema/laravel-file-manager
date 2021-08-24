<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

class FileManagerController
{
    public function render()
    {
        return view('file-manager::filemanager-page');
    }
}
