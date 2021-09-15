@push('after_scripts')
<!-- include select2 css-->
<link href="{{ asset('packages/select2/dist/css/select2.min.css') }}" rel="stylesheet" type="text/css" />
<link href="{{ asset('packages/select2-bootstrap-theme/dist/select2-bootstrap.min.css') }}" rel="stylesheet" type="text/css" />

@if (app()->getLocale() !== 'en')
<script src="{{ asset('packages/select2/dist/js/i18n/' . app()->getLocale() . '.js') }}"></script>
@endif

<script src="{{ asset('packages/select2/dist/js/select2.min.js') }}"></script>

<!-- selection js -->
<script src="https://cdn.jsdelivr.net/npm/@viselect/vanilla/lib/viselect.cjs.js"></script>

<!-- Upload Modal -->
<template class="upload-modal">
<div class="modal fade" id="upload-modal" tabindex="-1" aria-labelledby="uploadModalLabel" aria-hidden="true">
  <div class="modal-dialog" style="max-width:400px">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="uploadModalLabel">{{__("file-manager::messages.uploading")}} <span>n</span> {{__("file-manager::messages.medias")}}...</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div id="accordion" class="medias-list">

        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="modal-close btn btn-secondary" data-dismiss="modal">{{__("file-manager::messages.close")}}</button>
        <button type="button" class="modal-save btn btn-primary">{{__("file-manager::messages.upload")}} (<span>n</span>)</button>
      </div>
    </div>
  </div>
</div>
</template>

<!-- Edit Selected Media Modal -->
<div class="modal fade" id="edit-media-modal" tabindex="-1" aria-labelledby="editMediaModalLabel" aria-hidden="true">
  <div class="modal-dialog" style="max-width:400px">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="editMediaModalLabel">{{__("file-manager::messages.edit")}} {{__("file-manager::messages.media")}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      </div>
      <div class="modal-footer">
        <button type="button" class="modal-close btn btn-secondary" data-dismiss="modal">{{__("file-manager::messages.close")}}</button>
        <button type="button" class="modal-save btn btn-primary">{{__("file-manager::messages.save")}}</button>
      </div>
    </div>
  </div>
</div>

<!-- Asign Tag to Media Modal -->
<div class="modal fade" id="asign-tag-modal" data-backdrop="static" tabindex="-1" aria-labelledby="asignTagModalLabel" aria-hidden="true">
  <div class="modal-dialog" style="max-width:400px">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="asignTagModalLabel">{{__("file-manager::messages.asign_tag")}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">

      </div>
      <div class="modal-footer">
        <button type="button" class="modal-close btn btn-secondary" data-dismiss="modal">{{__("file-manager::messages.close")}}</button>
        <button type="button" class="modal-save btn btn-primary">{{__("file-manager::messages.save")}}</button>
      </div>
    </div>
  </div>
</div>

@endpush
