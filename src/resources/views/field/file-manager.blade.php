@php
$mediasIdString = '';
$medias = [];
if(isset($entry)){
    $class = get_class($entry);
    $mediaFieldId = $entry[$field['name']];
    $mediaIds = \DB::table('media_field_has_media')
        ->where('media_field_id', $mediaFieldId)
        ->pluck('media_id')
        ->toArray();

    $mediasIdString = implode('-', $mediaIds);

    $modelName = 'GemaDigital\FileManager\app\Models\Media';
    $mediaModel = new $modelName;
    $medias = $mediaModel
        ->whereIn('id', $mediaIds)
        ->with('mediaContent')
        ->get();
}
@endphp

<div class="col-12 m-0 p-0 filemanager-field" name="{{ $field['name'] }}">
    @include('crud::fields.inc.wrapper_start')
        <label>{!! $field['label'] !!}</label>
        <div class="mb-1">
            <a class="selected-medias-count btn-sm btn-link text-primary"><span class="selected-medias-number">{{count($medias)}}</span> {{__("file-manager::messages.medias_selected")}}<i class="las la-caret-down"></i></a>
        </div>
       
        <ul class="list-group selected-medias-list d-none">
            @if(count($medias) > 0)
                @foreach ($medias as $media)
                    <a href="#" data-media="{{$media->id}}" class="selected-media list-group-item list-group-item-action flex-column justify-content-between">
                        <div class="d-flex w-100 justify-content-between">
                            <div>
                                <b class="mb-1 m-0">{{$media->mediaContent->title}}</b>
                                <br> 
                                <small class="mb-1">{{$media->mediaContent->description}}</small>
                            </div>
                            <div>
                                <img src="{{$media->mediaContent->preview}}">
                            </div>
                        </div>
                    </a>
                @endforeach
            @else
                <li class="ml-1 list-group-item">
                    <small>{{ucfirst(__("file-manager::messages.no"))}} {{$field['label']}} {{ucfirst(__("file-manager::messages.selected"))}}</small>
                </li>
            @endif
        </ul>
        <input type="text" class="selected-medias-input d-none" name="{{ $field['name'] }}" value="">
        <div class="browse-media-btn-container my-1">
            <button type="button" class="filemanager-toggle btn-primary btn" disabled data-toggle="modal" data-target="#media-modal-{{ $field['name'] }}">
            {{ucfirst(__("file-manager::messages.browse"))}} {{ucfirst(__("file-manager::messages.medias"))}} <span class="la la-spinner la-spin"></span>
            </button>
        </div>
    @include('crud::fields.inc.wrapper_end')
</div>

@push('after_scripts')
    <div class="modal fade" id="media-modal-{{ $field['name'] }}" tabindex="-1" aria-labelledby="mediaModalLabel" aria-hidden="true">
        <div data-type="{{ $field['media_type'] }}" class="filemanager-field modal-dialog" style="max-width:800px" name="{{ $field['name'] }}">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="mediaModalLabel">{{ucfirst(__("file-manager::messages.media_manager"))}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="filemanager-container" class="col-12">
                    @include("file-manager::filemanager")
                </div>
            </div>
            <div class="modal-footer">
                <button id="selectFilesBtn" type="button" class="modal-close btn btn-primary" data-dismiss="modal"><i class="las la-save"></i> {{ucfirst(__("file-manager::messages.save_selection"))}}</button>
                <button type="button" class="modal-close btn btn-secondary" data-dismiss="modal">{{ucfirst(__('close'))}}</button>
            </div>
            </div>
        </div>
    </div>


{{-- ########################################## --}}
{{-- Extra CSS and JS for this particular field --}}
{{-- If a field type is shown multiple times on a form, the CSS and JS will only be loaded once --}}

{{-- FIELD JS - will be loaded in the after_scripts section --}}

<script>
    function mediaField(){
        var open = false;
        var openSelectedMedias = false;
        var selectedMedias = [];
        var fieldName = "{{ $field['name'] }}";
        var fieldSelector = '.filemanager-field[name="'+fieldName+'"]';

        var mediaIdString = '{{ $mediasIdString }}';
        var mediaIds = mediaIdString.split('-');

        if(isEditing()){
            document.querySelector(fieldSelector+' #filemanager-container')
            .addEventListener('medias-loaded', function(){
                $(fieldSelector+' .selectable').each(function(index, el){
                    for(id of mediaIds){
                        if(id === el.dataset.file){
                            el.classList.add('selected');
                            selectedMedias.push(el.dataset.file);
                        }
                    }
                    $(fieldSelector+' #selected-medias-num').text(selectedMedias.length)
                });  
                $(fieldSelector+ ' input[name="{{ $field['name'] }}"]').val(JSON.stringify({ medias : getSelectedMedias()}))
            })
        }
        
        $(fieldSelector+' .selected-medias-count').click(toggleSelectedMedias)

        function getSelectedMedias(){
            selectedMedias = [];
            $(fieldSelector+' .selectable.selected').each(function(index, el){
                selectedMedias.push(el.dataset.file)
            });

            return selectedMedias;
        }

        function toggleSelectedMedias(){
            if(openSelectedMedias){
                $(fieldSelector+' .selected-medias-list').addClass('d-none')
            }else{
                $(fieldSelector+' .selected-medias-list').removeClass('d-none')
            }
            openSelectedMedias = !openSelectedMedias;
        }

        function isEditing(){
            return window.location.pathname.split('/').pop() === 'edit';
        }
    }

    mediaField();
</script>
@endpush

{{-- End of Extra CSS and JS --}}
