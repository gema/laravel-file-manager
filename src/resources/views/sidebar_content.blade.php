@php
    $class = \GemaDigital\FileManager\app\Http\Controllers\Admin\Traits\Access::class;

    $accessFileManager = $class::hasAccess('file-manager');
    $accessMediaTag = $class::hasAccess('media-tag');
    $accessMediaType = $class::hasAccess('media-type');
    $accessMediaVersion = $class::hasAccess('media-version');
@endphp

@if($accessFileManager || $accessMediaTag || $accessMediaType || $accessMediaVersion)
<li class="nav-item nav-dropdown">
    <a class="nav-link nav-dropdown-toggle" href="#"><i class="nav-icon la la-files-o"></i> {{__("file-manager::messages.media_manager")}}</a>
    <ul class="nav-dropdown-items">
        @if($accessFileManager)
        <li class="nav-item"><a class='nav-link' href='{{ backpack_url('file-manager') }}'><i class='nav-icon la la-files-o'></i>{{__("file-manager::messages.media_explorer")}}</a></li>
        @endif

        @if($accessMediaTag)
        <li class="nav-item"><a class='nav-link' href='{{ backpack_url('media-tag') }}'><i class='nav-icon las la-tags'></i>{{__("file-manager::messages.media_tags")}}</a></li>
        @endif

        @if($accessMediaType)
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('media-type') }}'><i class="nav-icon las la-photo-video"></i></i> {{__("file-manager::messages.media_types")}}</a></li>
        @endif

        @if($accessMediaVersion)
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('media-version') }}'><i class="nav-icon las la-code-branch"></i> {{__("file-manager::messages.media_versions")}}</a></li>
        @endif
    </ul>
</li>
@endif