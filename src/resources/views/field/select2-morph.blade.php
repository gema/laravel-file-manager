<!-- select2_morph -->
@include('crud::fields.inc.wrapper_start')
    <label>{!! $field['label'] !!}</label>
    
    <select
        name="{{ $field['name'] }}"
        style="width: 100%"
        class="form-control select2-morph"
        data-init-function="initSelect2Morph"
    >
    </select>

    {{-- HINT --}}
    @if (isset($field['hint']))
        <p class="help-block">{!! $field['hint'] !!}</p>
    @endif
@include('crud::fields.inc.wrapper_end')

@if ($crud->fieldTypeNotLoaded($field))
    @php
        $crud->markFieldTypeAsLoaded($field);
    @endphp

    {{-- FIELD EXTRA CSS  --}}
    {{-- push things in the after_styles section --}}
    @push('crud_fields_styles')
         <!-- include select2 css-->
        <link href="{{ asset('packages/select2/dist/css/select2.min.css') }}" rel="stylesheet" type="text/css" />
        <link href="{{ asset('packages/select2-bootstrap-theme/dist/select2-bootstrap.min.css') }}" rel="stylesheet" type="text/css" />
    @endpush

    {{-- FIELD EXTRA JS --}}
    {{-- push things in the after_scripts section --}}
    @push('crud_fields_scripts')
        <!-- include select2 js-->
        <script src="{{ asset('packages/select2/dist/js/select2.full.min.js') }}"></script>
        <script src="{{ asset('packages/select2/dist/js/i18n/' . str_replace('_', '-', app()->getLocale()) . '.js') }}"></script>
        <script>

            var name = "{{ $field['name'] }}";
            var url = "{{ $field['url'] }}"; 
            var selector = '.select2-morph[name="'+name+'"]';

            function initSelect2Morph(){
                const finished = [];
                $(selector).select2({
                    ajax: {
                        url,
                        dataType: 'json',
                        processResults: function({data}){
                            const parentsNumber = Object.keys(data).length;
                            const results = [];
                            let more;

                            console.log({parentsNumber})

                            if (parentsNumber > 1) {
                                Object.entries(data).forEach(([namespace, response]) => {
                                    console.log(namespace, response);
                                    if (response.current_page === response.last_page)
                                        finished.push(namespace);
                                    if (response.data.length) {
                                        results.push({
                                            text: namespace.split('\\').pop(),
                                            children: Object.values(response.data).map(entry => {
                                                return {
                                                    id: entry.id,
                                                    text: entry.name,
                                                    namespace,
                                                }
                                            })
                                        })
                                    } 
                                });
                                more = finished.length < parentsNumber;
                            } else {
                                Object.entries(data).forEach(([namespace, response]) => {
                                    Object.values(response.data).forEach(entry => {
                                        results.push({
                                            id: entry.id,
                                            text: entry.name,
                                            namespace,
                                        })
                                    })
                                    more = response.current_page < response.last_page;
                                })
                            }

                            return {
                                results,
                                pagination: {more}
                            }
                        }
                    }
                }).on('select2:select', e => {
                    const data = e.params.data;
                    $(selector).children()[0].dataset.namespace = data.namespace;
                });
            }

            $('form').on('submit', function(e){
                var attr = $(selector).find(':selected').data();
                console.log(attr);
                if(attr !== undefined){
                    $('.parent-type-field input').val(attr.namespace);
                }
                console.log($(this).serialize());
                return true;
            })
        </script>
     @endpush
@endif