/* eslint-disable camelcase */
/* eslint-disable no-use-before-define */
const {
  truncate,
} = require('./utils');

const mediaItem = media => `
<div
  title="${media.media_content.title}" 
  class="ui-widget-content selectable col-md-2 col-sm-3 m-1 p-3 flex flex-column" data-file="${media.id}"
  style="height: fit-content"
>
  <img class="m-auto mb-2" src="${media.media_content.preview}">
  <p class="mb-0 text-center">${truncate(media.media_content.title, 18)}</p>
  <p class="text-sm mb-0 text-center font-weight-light">${media.media_content.updated_at.slice(0, 10)}</p>
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
`);

const tagsSelect = tags => {
  const options = tagsSelectOptions(tags);
  return `
  <select name="tags" class="tags-select form-control">
  ${options}
  </select>`;
};

const tagsLoader = () => '<span class="w-100 text-center tags-loader la la-spinner la-spin mt-3"></span>';

const uploadModalTitle = length => `
  Uploading <span class="medias-count">${length}</span> medias
`;

const uploadPreview = (file, i, types, mediaType, extraFields) => {
  const {
    media,
  } = file;
  const ext = media.name.split('.').pop();
  const ext3D = ['dae', 'abc', 'usd', 'usdc', 'usda', 'ply', 'stl', 'fbx', 'glb', 'gltf', 'obj', 'x3d'];
  const is3d = ext3D.includes(ext);
  const mediaPreviewTemplate = mediaPreview(media, i, is3d);
  const metadataFormTemplate = metadataForm(i, types, {
    media,
    is3d,
  }, mediaType, extraFields);
  visitdataForm(i);

  let mediaSize = media.size;
  let unit = '';
  let j = 0;
  const units = ['KB', 'MB', 'GB'];

  while (mediaSize > 1024 && j < units.length) {
    mediaSize = Math.round(mediaSize / 1024);
    unit = units[j];
    j += 1;
  }

  return `
    <div class="card file-row overflow-hidden border-0" data-name="${media.name}">
      <div class="card-header border-0" id="heading_${i}">
        <h5 class="mb-0" style="text-align:center">
          <button
            class="btn text-dark"
            data-toggle="collapse"
            data-target="#collapse_${i}"
            aria-expanded="true"
            aria-controls="collapse_${i}"
            title="${media.name}"
          >
          <b>${truncate(media.name, 25)}</b> ${mediaSize} ${unit}
          <span class="loader-container"></span>
          </button>
          <a href="#" class="text-danger">
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
        class="collapse"
        aria-labelledby="heading_${i}"
        data-parent="#accordion">   
        <div class="card-body border border-top-0 overflow-hidden">
          ${mediaPreviewTemplate}
          ${metadataFormTemplate}
        </div>
      </div>
    </div>
  `;
};

const visitdataForm = i => `
    <div id="select2-container-${i}" class="form-group">
      
    </div>
  `;

const metadataForm = (i, types, { media, is3d }, mediaType, extraFields) => {
  // let {
  //   name,
  //   type,
  // } = media;
  let name = "";
  if (media.name) name = media.name;
  else if (media.media_content) name = media.media_content.title;
  else if (media.media) name = media.title;
  const type = media.type ? media.type : media.type_id;
  if (is3d) type = 'model';
  const typesListTemplate = typesList(types, type, mediaType);
  const extraFieldsTemplate = extraFieldsTest(extraFields);
  return `
    <form id="metadata-form-${i}">
      <div class="form-group">
        <label>Title</label>
        <input name="title" type="text" class="form-control" value="${name.split('.').shift()}">
      </div>
      ${extraFieldsTemplate}
      ${typesListTemplate}
    </form>`;
};

const typesList = (types, type, mediaType) => {
  let list = '';
  types.forEach(type => {
    list += `<option ${type.id === mediaType ? 'selected' : ''} value="${mediaType}">${type.name}</option>`;
  });

  return `
  <div class="form-group d-none">
    <label>Media Type</label>
    <select name="type" class="form-control">
      ${list}
    </select>
  </div>`;
};

const extraFieldsTest = (extraFields) => {
  let list = '';
  extraFields.forEach(field => {
    list += `<div class="form-group">
                <label>${field.name}</label>
                <input name="${field.slug} extra-field" type="${field.type}" class="form-control"/>
              </div>`;
  });

  return list;
};

const mediaPreview = (media, i, is3d) => {
  const {
    type,
  } = media;
  const typesWithoutPreview = ['video/avi'];

  let template = '';

  if (is3d) {
    template = model3dTemplate();
  } else if (typesWithoutPreview.includes(type)) {
    template = noPreview(type);
  } else if (/^image/.test(type)) {
    template = imagePreview(media, i);
  } else if (/^video/.test(type)) {
    template = videoPreview(i);
  } else if (/^audio/.test(type)) {
    template = audioPreview(i);
  }

  return template;
};

const noPreview = type => `
  <small>No preview available for type ${type}</small>
`;

const model3dTemplate = () => '3D Model Preview';

const imagePreview = (media, i) => {
  const uncropableTypes = ['image/gif'];
  let cropTemplate = '';

  if (!uncropableTypes.includes(media.type)) {
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
};

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

const selectedMedia = ({
  media_content,
  name,
  id,
}) => {
  const description = media_content
    ? media_content.description
    : __('noDescription');

  return `
  <a
    href="#"
    data-media="${id}"
    class="selected-media list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex w-100 justify-content-between">
      <div>
        <b class="mb-1 m-0">
          ${media_content ? media_content.title : name}
        </b>
        </br>
        <small class="mb-1">${description}</small>
      </div>
      <div class="selected-media-preview">
        <img src="${media_content.preview}">
      </div>
    </div>
  </a>
`;
};
module.exports = {
  templates: {
    mediaItem,
    paginationLoader,
    noMediasFound,
    tagItem,
    noTagsFound,
    tagsSelectOptions,
    tagsSelect,
    tagsLoader,
    uploadModalTitle,
    mediaPreview,
    noPreview,
    imagePreview,
    videoPreview,
    audioPreview,
    uploadPreview,
    uploadFeedback,
    metadataForm,
    selectedMedia,
    visitdataForm,
  },
};
