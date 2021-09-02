const { truncate } = require('../utils');

const mediaItem = media => `
<div
  title="${media.media_content.title}" 
  class="ui-widget-content selectable col-md-2 col-sm-3 m-1" data-file="${media.id}"
>
  <img src="${media.media_content.preview}">
  <small>${truncate(media.media_content.title, 10)}</small>
</div>
`;

const paginationLoader = () => `
<div class="pagination-loader col-sm-12 d-flex justify-content-center m-0">
  <h4><span class="la la-spinner la-spin mt-3"></span></h4>
</div>`;

const noMediasFound = () => '<p>No Medias Found<p>';

const tagItem = tag => `
<li class="list-group-item">
  <a href="#" title="${tag.name}" class="select-tag" data-tag="${tag.id}">
    ${truncate(tag.name, 10)}
  </a>
</li>
`;

const noTagsFound = () => '<li  class="list-group-item">No Tags</li>';

const tagsSelectOptions = tags => tags.map(tag => `
  <option value="${tag.id}">
    ${tag.name}
  </option>
`)

const tagsSelect = tags => {
  const options = tagsSelectOptions(tags);
  return `
  <select name="tags" class="tags-select form-control">
  ${options}
  </select>`;
}

const uploadModalTitle = length => `
  Uploading <span class="medias-count">${length}</span> medias
`;

const uploadPreview = (file, i, types) => {
  const {media} = file;
  const mediaPreviewTemplate = mediaPreview(media, i);
  const metadataFormTemplate = metadataForm(i, types);

  let mediaSize = media.size;
  let unit = '';
  let j = 0;
  const units = ['KB', 'MB', 'GB']

  while (mediaSize > 1024 && j < units.length) {
    mediaSize = Math.round(mediaSize / 1024);
    unit = units[j];
    j++;
  }

  return `
    <div class="card file-row" data-name="${media.name}">
      <div class="card-header" id="heading_${i}">
        <h5 class="mb-0" style="text-align:center">
          <button
            class="btn btn-link"
            data-toggle="collapse"
            data-target="#collapse_${i}"
            aria-expanded="true"
            aria-controls="collapse_${i}"
            title="${media.name}"
          >
          <b>${truncate(media.name, 25)}</b> ${mediaSize} ${unit}
          <span class="loader-container"></span>
          </button>
          <a href="#" style="float:right" class="text-danger">
            <i
              style="vertical-align:middle"
              data-name="${media.name}"
              class="remove-media-btn las la-trash-alt">
            </i>
          </a>
        </h5>
      </div>
      <div
        id="collapse_${i}" 
        class="collapse ${i === 0 ? 'show' : ''}"
        aria-labelledby="heading_${i}"
        data-parent="#accordion">   
        <div class="card-body">
          ${mediaPreviewTemplate}
          ${metadataFormTemplate}
        </div>
      </div>
    </div>
  `;
}

const metadataForm = (i, types) => {
  const typesListTemplate = typesList(types);
  const select = `
    <div id="select2-container-${i}" class="form-group">
      
    </div>
  `;

  return `
    <form id="metadata-form-${i}">
      ${select}
      <div class="form-group">
        <label>Title</label>
        <input name="title" type="text" class="form-control">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description" class="form-control"></textarea>
      </div>
      ${typesListTemplate}
    </form>`;
}

const typesList = types => {
  let typesList = '';
  types.forEach(type => {
    typesList += `<option value="${type.id}">${type.name}</option>`;
  });

  return `
  <div class="form-group">
    <label>Media Type</label>
    <select name="type" class="form-control">
      ${typesList}
    </select>
  </div>`;
}

const mediaPreview = (media, i) => {
  const {type} = media;
  console.log(type);
  const typesWithoutPreview = ['video/avi'];

  let template = '';
  let hasVideo = false;
  let hasAudio = false;

  if(typesWithoutPreview.includes(type)){
    template = noPreview(type);
  }
  else if(/^image/.test(type)){
    template = imagePreview(media, i)
  }
  else if (/^video/.test(type)) {
    hasVideo = true;
    template = videoPreview(i)
  }
  else if (/^audio/.test(type)) {
    hasAudio = true;
    template = audioPreview(i)
  }

  return template;
}

const noPreview = type => `
  <small>No preview available for type ${type}</small>
`;

const imagePreview = (media, i) => {
  const uncropableTypes = ['image/gif'];
  let cropTemplate = '';

  if(!uncropableTypes.includes(media.type)){
    cropTemplate = `
    <button id="crop-btn-${i}" class="form-control btn btn-default btn-sm crop-btn" data-id="${i}">
      Crop
    </button>
    <div class="mt-1" id="crop_image_${i}">
      ${cropImageTemplate(media, i)}
    </div>
    `;
  }

  return `
    <img
      id="image-preview-${i}" 
      class="w-100 my-3"
      src="${URL.createObjectURL(media)}"
    >
    ${cropTemplate}
  `;
}

const cropImageTemplate = (media, i) => {
  const tmpImg = document.createElement('img');
  tmpImg.classList.add(`to_be_crop_${i}`);
  tmpImg.style.maxWidth = '100%';
  tmpImg.src = URL.createObjectURL(media);

  const buttonConfirm = document.createElement('button');
  buttonConfirm.textContent = 'Confirm';
  buttonConfirm.classList = 'confirm-crop btn btn-default btn-sm';
  buttonConfirm.id = `crop_btn_${i}`;
  buttonConfirm.dataset.id = i;

  return `
  <div class="d-none" id="imageCropper_${i}">
    ${buttonConfirm.outerHTML}
    ${tmpImg.outerHTML}
  </div>`;
};

const videoPreview = i => `
<video controls id="video-preview-video-${i}" class="w-100 my-3">
  <source id="video-preview-source-${i}" src="">
  Your browser does not support the video tag.
</video>`;

const audioPreview = i => `
<audio class="w-100 my-3" id="audio-preview-audio-${i}" controls>
  <source src="" id="audio-preview-source-${i}" />
</audio>`;

const uploadFeedback = (msg, textClass) => `
<p
  class="mt-2 mb-0 text-${textClass} text-center">
  ${msg}
</p>`;

const editMediaModal = () => {

}

module.exports = {
  templates: {
    mediaItem,
    paginationLoader,
    noMediasFound,
    tagItem,
    noTagsFound,
    tagsSelectOptions,
    tagsSelect,
    uploadModalTitle,
    mediaPreview,
    noPreview,
    imagePreview,
    videoPreview,
    audioPreview,
    uploadPreview,
    uploadFeedback,
    metadataForm
  },
}