@push('after_styles')
    <link rel="stylesheet" href="/bundles/css/bundle.css" />
@endpush

@include("file-manager::translations")
@include('file-manager::filemanager-modals')

@if (isset($crud) && ($crud->checkIfFieldIsFirstOfItsType($field, $fields) || isset($field['first'])))
    @push('after_scripts')
        <script>
            $(document).on('show.bs.modal', '.modal', function () {
                var zIndex = 1040 + (10 * $('.modal:visible').length);
                $(this).css('z-index', zIndex);
                setTimeout(function() {
                    $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
                }, 0);
            });
        </script>
    @endpush
@endif

@push('after_scripts')
    <script type="text/javascript" src="/bundles/js/bundle.js"></script>
@endpush

<div class="custom-file-manager card">
    <div class="card-header">
        <ul class="list-inline">
            <li class="list-inline-item">
                <a id="upload-button">
                    <i class="las la-upload"></i>
                    {{__("file-manager::messages.upload")}}
                </a>

            </li>
            <!-- <li class="list-inline-item">
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
            </li> -->
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
        <!-- <div class="tags-container col-sm-2">
            <ul class="list-group">
            </ul>
        </div> -->
        <div class="col-sm-12">
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
