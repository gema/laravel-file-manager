@include('crud::fields.inc.wrapper_start')
<label>{!! $field['label'] !!}</label>


{{-- ########################################## --}}
{{-- Extra CSS and JS for this particular field --}}
{{-- If a field type is shown multiple times on a form, the CSS and JS will only be loaded once --}}
@if ($crud->checkIfFieldIsFirstOfItsType($field, $fields))

{{-- FIELD JS - will be loaded in the after_scripts section --}}
@push('crud_fields_scripts')
<script>

</script>
@endpush

@endif
{{-- End of Extra CSS and JS --}}
