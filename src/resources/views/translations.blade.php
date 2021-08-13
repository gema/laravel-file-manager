<script>
  window.Laravel = {
    translations: {
        selectMediasFirst : '{{__("Select some medias first")}}',
        tagsUnsigned : '{{__("Tags removed successfully")}}',
        tagsUnsignedError : '{{__("There was an error unsigning tags")}}',
        tagsAsigned : '{{__("Tags asigned successfully")}}',
        tagsAsignedError : '{{__("There was an error asigning tags")}}',
        mediaUpdated : '{{__("Media updated")}}',
        noDescription : '{{__("No description provided")}}',
        noMediasSelected: '{{__("No medias selected")}}',
        noMediasFound : '{{__("No medias found")}}',
        mediaType : '{{__("Media type")}}',
        parent : '{{__("parent")}}',
        title : '{{__("Title")}}',
        description : '{{__("description")}}',
        crop : '{{__("crop")}}',
        imageCropped : '{{__("Image cropped successfully")}}',
        invalidMetadata : '{{__("Invalid metadata provided")}}',
        asignTag : '{{__("asign tag")}}',
        removeTag : '{{__("remove tag")}}',
      }
  };

  window.__ = window.trans = (key, args = []) => {
    let result = window.Laravel.translations[key];
    args.forEach(arg => result = result.replace('$', arg));
    return result;
  }
</script>
