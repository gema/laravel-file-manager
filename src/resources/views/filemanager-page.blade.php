@extends(backpack_view('blank'))

@section('content')

<div class="container h-100">
    <div class="row h-100 justify-content-center">
        <div class="col-sm-12">
            <h1 class="my-4">{{__("file-manager::messages.media_manager")}}</h1>
            @include("file-manager::filemanager")
        </div>
    </div>
</div>

@endsection

@include('file-manager::filemanager-modals')
@include("file-manager::translations")
