<?php

namespace GemaDigital\FileManager\app\Http\Controllers\Admin;

class FileManagerController
{
    use Traits\Access;

    public function render()
    {
        // Access
        $this->hasAccess('media-version') || abort(401);

        return view('file-manager::filemanager-page');
    }
}
