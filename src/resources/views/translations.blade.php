<script>
  window.FileManager = {
    translations : {
      selectMediasFirst : '{{__("file-manager::messages.select_medias_first")}}',
      tagsUnsigned : '{{__("file-manager::messages.tags_unsigned")}}',
      tagsUnsignedError : '{{__("file-manager::messages.tags_unsigned_error")}}',
      tagsAsigned : '{{__("file-manager::messages.tags_asigned")}}',
      tagsAsignedError : '{{__("file-manager::messages.tags_asigned_error")}}',
      mediaUpdated : '{{__("file-manager::messages.media_updated")}}',
      noDescription : '{{__("file-manager::messages.no_description")}}',
      noMediasSelected: '{{__("file-manager::messages.no_medias_selected")}}',
      mediasSelected : '{{__("file-manager::messages.medias_selected")}}',
      noMediasFound : '{{__("file-manager::messages.no_medias_found")}}',
      mediaType : '{{__("file-manager::messages.media_type")}}',
      parent : '{{__("file-manager::messages.parent")}}',
      title : '{{__("file-manager::messages.title")}}',
      description : '{{__("file-manager::messages.description")}}',
      crop : '{{__("file-manager::messages.crop")}}',
      imageCropped : '{{__("file-manager::messages.image_cropped")}}',
      invalidMetadata : '{{__("file-manager::messages.invalid_metadata")}}',
      asignTag : '{{__("file-manager::messages.asign_tag")}}',
      removeTag : '{{__("file-manager::messages.remove_tag")}}',
      noPreview : '{{__("file-manager::messages.no_preview")}}'
    }
  }

  if(window.__ !== undefined){
    const translations = window.FileManager.translations;
    const baseTranslations = window.Laravel.translations;
    window.Laravel.translations = { ...baseTranslations, ...translations }
  } else {
    window.Laravel = { translations : window.FileManager.translations };
    window.__ = window.trans = (key, args = []) => {
      let result = window.Laravel.translations[key];
      args.forEach(arg => result = result.replace('$', arg));
      return result;
    }
  }
</script>
