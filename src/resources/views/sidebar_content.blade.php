<li class="nav-item nav-dropdown">
    <a class="nav-link nav-dropdown-toggle" href="#"><i class="nav-icon la la-files-o"></i> {{__("file-manager::messages.media_manager")}}</a>
    <ul class="nav-dropdown-items">
        <li class="nav-item"><a class='nav-link' href='{{ backpack_url('file-manager') }}'><i class='nav-icon la la-files-o'></i>{{__("file-manager::messages.media_explorer")}}</a></li>
        <li class="nav-item"><a class='nav-link' href='{{ backpack_url('media-tag') }}'><i class='nav-icon las la-tags'></i>{{__("file-manager::messages.media_tags")}}</a></li>
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('media-type') }}'><i class="nav-icon las la-photo-video"></i></i> {{__("file-manager::messages.media_types")}}</a></li>
        <li class='nav-item'><a class='nav-link' href='{{ backpack_url('media-version') }}'><i class="nav-icon las la-code-branch"></i> {{__("file-manager::messages.media_versions")}}</a></li>
    </ul>
</li>