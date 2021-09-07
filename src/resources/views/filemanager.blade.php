@php
    use Illuminate\Support\Facades\File;

    $publicPath = '/vendor/gemadigital/file-manager/src/public';
    $jsBundle = File::get(base_path() . $publicPath . '/js/bundle.js');
    $cssBundle = File::get(base_path() . $publicPath . '/css/bundle.css');
    $parentsField = call_user_func(config('file-manager.parents_field'));
    $parentsField = $parentsField ? 1 : 0;
    @endphp

@if (isset($crud))
    @if ($crud->checkIfFieldIsFirstOfItsType($field, $fields))
        @push('after_styles')
            <link href="https://unpkg.com/cropperjs/dist/cropper.css" rel="stylesheet"/>
            <style>{!! $cssBundle !!}</style>
        @endpush
        @push('after_scripts')
            <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
            <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js" integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30=" crossorigin="anonymous"></script>
            <script>
                window.parentsField = '{{$parentsField}}'
                $(document).on('show.bs.modal', '.modal', function () {
                    var zIndex = 1040 + (10 * $('.modal:visible').length);
                    $(this).css('z-index', zIndex);
                    setTimeout(function() {
                        $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
                    }, 0);
                });
            </script>
            <script type="text/javascript">{!! $jsBundle !!}</script>

        @endpush

        @include('file-manager::filemanager-modals')
        @include("file-manager::translations")
    @endif
@else
    @include("file-manager::translations")
    @push('after_styles')
        <link href="https://unpkg.com/cropperjs/dist/cropper.css" rel="stylesheet"/>
        <style>{!! $cssBundle !!}</style>
    @endpush
    @push('after_scripts')
        <script src="https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.5.12/cropper.min.js"></script>
        <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js" integrity="sha256-T0Vest3yCU7pafRw9r+settMBX6JkKN06dqBnpQ8d30=" crossorigin="anonymous"></script>
        <script type="text/javascript">{!! $jsBundle !!}</script>
        <script>window.parentsField = '{{$parentsField}}'</script>
    @endpush

    @include('file-manager::filemanager-modals')
@endif

<div class="custom-file-manager card">
    <div class="card-header">
        <ul class="list-inline">
            <li class="list-inline-item">
                <a id="upload-button">
                    <i class="las la-upload"></i>
                    {{__("file-manager::messages.upload")}}
                </a>

            </li>
            <li class="list-inline-item">
                <a id="asign-tag-button">
                <i class="las la-tag"></i>
                {{__("file-manager::messages.asign_tag")}}
                </a>
            </li>
            <li class="list-inline-item">
                <a id="unsign-tag-button">
                <i class="las la-trash"></i>
                {{__("file-manager::messages.remove_tag")}}
                </a>
            </li>
            <li class="list-inline-item">
                <a id="refreshBtn">
                    <i class="las la-sync"></i>
                    {{__("file-manager::messages.refresh")}}
                </a>
            </li>
        </ul>
    </div>
    <div class="selection-area-container card-body">
    <div class="row">
        <div class="tags-container col-sm-2">
            <ul class="list-group">
            </ul>
        </div>
        <div class="col-sm-10">
            <div class="col-sm-12 d-flex justify-content-center m-0">
                <h4 class="media-loader d-none"><span class="la la-spinner la-spin mt-3"></span></h4>
            </div>
            <div class="selection-area list row my-2">
            </div>
        </div>
    </div>
    </div>
    <input type="file" class="d-none" name="medias" size="chars" id="upload-field" multiple>
</div>
