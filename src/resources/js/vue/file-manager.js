import $ from 'jquery';
import 'jquery-ui/ui/widgets/selectable';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

const { request, toast, customEvent } = require('../utils');
const { templates } = require('./templates');

let globalTags;
let globalMediaTypes;
let globalOptions;
let globalUploadList;

let globalMediaListContainer;
let globalTagsListContainer;

const init = options => {
  globalOptions = options;
  loadGlobals(onGlobalsLoaded);
}

const loadGlobals = (callback = false) => {
  // toggleLoader(true);
  request(
    '/admin/media/fetch/global-data',
    callback,
    'POST'
  )
};

const toggleLoader = visible => {
  const container = document.querySelector('.selection-area');
  if (container) {
    container.innerHTML = '';
    const loader = document.querySelector('.media-loader');
    loader.classList.toggle('d-none', !visible)
  }
}

const onGlobalsLoaded = globals => {
  setGlobals(globals);
  loadMedias();
}

const setGlobals = ({ data }) => {    
  const { tags, types } = data;
  globalTags = tags.data;
  globalMediaTypes = types.data;
    
  globalMediaListContainer = document.querySelector('.custom-file-manager .list');
  globalTagsListContainer = document.querySelector('.tags-container ul');
}

const loadMedias = () => {
  fetchMedias({
    type: globalOptions.mediaType,
  }, initMediaField)
}

const fetchMedias = ({page, tags, type}, callback = false) => {
  if (page === undefined) page = 1;
  if (tags === undefined) tags = null;
  if (type === undefined) type = false;
    
  request(`/admin/media/fetch/media?page=${page}`, callback, 'POST', {
    _token: document.querySelector('meta[name=csrf-token]').content,
    tags,
    type,
  });
};

const initMediaField = ({data, last_page}) => {
  renderMediaList(data);
  initScroll(last_page);
  initTags();
  initRefresh();
  initUpload();
}


// Render Media List

const renderMediaList = medias => {
  toggleLoader(false);
  clearMediaListContainer();
  medias.length ?
    renderMediaItems(medias) : renderNoMediasFound()
  initSelection(medias);
}

const clearMediaListContainer = () => {
  globalMediaListContainer.innerHTML = '';
}

const renderMediaItems = medias => {
  medias.forEach(media =>
    globalMediaListContainer.innerHTML += templates.mediaItem(media)
  );
}

const renderNoMediasFound = () => {
  globalMediaListContainer.innerHTML += templates.noMediasFound();
}


// Selection

const initSelection = medias => {
  $('.selection-area')
    .selectable();

  $('#media-modal .modal-footer')
    .find('.btn-primary')
    .on('click', () => onMediasSelected(medias));
}

const onMediasSelected = medias => {
  const selectedMedias = getSelectedMedias();
  const value = JSON.stringify({ medias: selectedMedias });
  const totalSelectedMedias = selectedMedias.length;
  const { min, max } = globalOptions;

  if(totalSelectedMedias > max || totalSelectedMedias < min){
    if(min === max){
      toast(`Please select exactly ${min} medias`, 'error');
    }else{
      toast(`Please select between ${min} and ${max} medias`, 'error')
    }
  }
  else if(selectedMedias.length){
   $(`.selected-medias-input[name="${globalOptions.name}"]`)
    .val(value)
    customEvent(`change_${globalOptions.name}`, {value, medias, selectedMedias});
  }
}

const getSelectedMedias = () => {
  return Object.values(document.querySelectorAll('.selection-area div.ui-selected'))
    .map(selectable => selectable.dataset.file);
}


// Init Scroll

const initScroll = lastPage => {
  let page = 1;
  let isLoading = false;
  $(globalMediaListContainer).on('scroll', () => {
    if( globalMediaListContainer.offsetHeight + globalMediaListContainer.scrollTop >=
        globalMediaListContainer.scrollHeight - 1) {
      if (!isLoading && page + 1 <= lastPage) {
        page += 1;
        isLoading = true;
        globalMediaListContainer.innerHTML += templates.paginationLoader();

        fetchMedias({
          page,
          tags: getSelectedTags(),
          type: globalOptions.mediaType,
        }, onPageLoaded)
      }
    }
  })
}

const onPageLoaded = ({data}) => {
  removePaginationLoader();
  renderMediaList(data);
  // isLoading = false;
}

const removePaginationLoader = () => {
  document.querySelector('.pagination-loader').remove();
}


// Init Tags

const initTags = () => {
  clearTagsListContainer();
  globalTags.length ? renderTagItems(globalTags) : renderNoTagsFound();
  initFilterByTag();
  initAsignTag();
  initUnsignTag();
}

const clearTagsListContainer = () => {
  globalTagsListContainer.innerHTML = '';
}

const renderTagItems = tags => {
  tags.forEach(tag => {
    globalTagsListContainer.innerHTML += templates.tagItem(tag)
  })
}

const renderNoTagsFound = () => {
  globalTagsListContainer.innerHTML += templates.noTagsFound();
}

const initFilterByTag = () => {
  document.querySelectorAll('.select-tag').forEach(tagBtn => {
    tagBtn.addEventListener('click', event => {
      toggleTagBtn(event.currentTarget.parentNode);
      toggleLoader(true);
      fetchMedias({
        page: 1,
        tags: getSelectedTags(),
        type: globalOptions.mediaType,
      }, onListLoaded)
    })
  })
}

const toggleTagBtn = parent => {
  const isSelected = Object.values(parent.classList).includes('selected');
  parent.classList.toggle('selected', !isSelected);
}

const getSelectedTags = () => {
  const tagsIds = [];
  document
    .querySelectorAll('.selected .select-tag')
    .forEach(tagBtn => tagsIds.push(parseInt(tagBtn.dataset.tag, 10)));
  return tagsIds;
}

const onListLoaded = ({data}) => {
  renderMediaList(data);
}

const initAsignTag = () => {
  document.querySelector('#asign-tag-button').addEventListener('click', onAsignTagClick)
}

const onAsignTagClick = e => {
  const selectedMedias = getSelectedMedias();
  if(selectedMedias.length) {
    customEvent(`asign_tag_${globalOptions.name}`)
    setTimeout(() => {
      const modal = initTagsModal('Asign Tag');
      const saveButton = modal.querySelector('footer .btn-primary');
      saveButton.addEventListener('click', onSaveAsignTag);
    }, 100)
  }else{
    toast('Select some medias first', 'error');
  }
}

const initTagsModal = title => {
  const modal = document.querySelector('#tag-modal');
  modal.querySelector('.modal-title').textContent = title;
  modal.querySelector('.modal-body').innerHTML += templates.tagsSelect(globalTags);
  return modal;
}

const onSaveAsignTag = e => {
  const tags = [document.querySelector('#tag-modal .tags-select').value]
  const formData = new FormData();
  formData.append('tags', tags);
  formData.append('medias', getSelectedMedias())

  asignTagRequest(formData);
}

const asignTagRequest = body => {
  fetch('/api/media/tag', {
    method: 'POST',
    body,
  })
    .then(r => r.json())
    .then(response => {
      if (response.data) {
        toast('Tags asigned');
      } else toast('There was an error asigning tags', 'danger');
    })
    .catch(e => console.log(e));
}

const initUnsignTag = () => {
  document.querySelector('#unsign-tag-button').addEventListener('click', onUnsignTagClick)
}

const onUnsignTagClick = e => {
  const selectedMedias = getSelectedMedias();
  if(selectedMedias.length) {
    customEvent(`unsign_tag_${globalOptions.name}`)
    setTimeout(() => {
      const modal = initTagsModal('Unsign Tag');
      const saveButton = modal.querySelector('footer .btn-primary');
      saveButton.addEventListener('click', onSaveUnsignTag);
    }, 100)
  }else{
    toast('Select some medias first', 'error');
  }
}

const onSaveUnsignTag = e => {
  const tags = [document.querySelector('#tag-modal .tags-select').value]
  const formData = new FormData();
  formData.append('tags', tags);
  formData.append('medias', getSelectedMedias())

  unsignTagRequest(formData);
}

const unsignTagRequest = body => {
  fetch('/api/media/tag/unsign', {
    method: 'POST',
    body,
  })
    .then(r => r.json())
    .then(response => {
      if (response.data) {
        toast('Tags unsigned');
      } else toast('There was an error unsigning tags', 'danger');
    })
    .catch(e => console.log(e));
}


// Refresh

const initRefresh = () => {
  document.querySelector('#refreshBtn').addEventListener('click', onRefreshClick);
}

const onRefreshClick = e => {
  toggleLoader(true);
  fetchMedias({
    page: 1,
    type: globalOptions.mediaType
  }, onRefresh)
}

const onRefresh = ({data}) => {
  renderMediaList(data);
}


// Upload

const initUpload = () => {
  const uploadButton = document.querySelector(`#upload-button`);
  const hiddenInput = document.querySelector(`#upload-field`);

  hiddenInput.addEventListener('change', onHiddenInputChange)
  uploadButton.addEventListener('click', onUploadClick)
}

const onUploadClick = e => {
  const hiddenInput = document.querySelector(`#upload-field`);
  hiddenInput.value = '';
  hiddenInput.click();
}

const onHiddenInputChange = e => {
  globalUploadList = [];
  e.currentTarget.files.forEach(media => {
    globalUploadList.push({media, cropped: null })
  });

  customEvent(`upload_modal_open_${globalOptions.name}`);
  setTimeout(initUploadModal, 100);
}

const initUploadModal = (files = globalUploadList) => {
  const uploadModal = document.querySelector('#upload-modal');
  uploadModal.querySelector('.modal-title').innerHTML += templates.uploadModalTitle(files.length)
  renderUploadsPreview(files);
  uploadModal.querySelector('footer .btn-primary')
    .addEventListener('click', e => {
      onUploadSave(e, files)
    });
  initCrop();
}

const renderUploadsPreview = files => {
  initRemoveButtons(files);
  const listContainer = document.querySelector('#upload-modal .medias-list');
  listContainer.innerHTML = '';
  let i = 0;

  files.forEach(file => {
    listContainer.innerHTML += templates.uploadPreview(file, i, globalMediaTypes);
    initVideoPreview(file.media, i);
    initAudioPreview(file.media, i);
    i++;
  })
}

const initRemoveButtons = (files) => {
  const removeMediaBtns = document.querySelectorAll('.remove-media-btn');
  removeMediaBtns.forEach(removeBtn => {
    removeBtn.addEventListener('click', e => {
      const mediaName = e.target.dataset.name;
      files = files.filter(file => file.media.name !== mediaName);
      initUploadModal(files);
    });
  });
}

const initVideoPreview = (media, i) => {
  const video = document.querySelector(`#video-preview-video-${i}`);
  if (video) {
    const reader = new FileReader();
    reader.onloadend = () => {
      video.src = reader.result;
    };
    reader.readAsDataURL(media);
  }
}

const initAudioPreview = (media, i) => {
  const audio = document.querySelector(`#audio-preview-source-${i}`);
  if (audio ) {
    audio.src =
    URL.createObjectURL(media);
    document.querySelector(`#audio-preview-audio-${i}`).load();
  }
}

const onUploadSave = (e, files) => {
  e.currentTarget.classList.add('d-none');
  appendLoadersToUploads(files);
  resolveUploadPromises(generateUploadPromises(files));
}

const appendLoadersToUploads = () => {
  const fileNames = document.querySelectorAll('span.loader-container');
    fileNames.forEach(fileName => {
      fileName.innerHTML +=
        '<span class="ml-2 la la-spinner la-spin"></span>';
    });
}

const generateUploadPromises = files => {
  let i = 0;
  const promises = [];
  files.forEach(file => {
    const metadata = generateFileMetadata(file, i);
    promises.push(makeUploadPromise(metadata));
    i++;
  })
  return promises;
}

const generateFileMetadata = (file, i) => {
  const metadata = {};
  const metadataFields = document.querySelectorAll(
    `#metadata-form-${i} .form-control`
  );
  metadataFields.forEach(field => (metadata[field.name] = field.value));

  metadata.media = file.media;
  metadata.cropped = file.cropped ? file.cropped : null;
  metadata.name = file.media.name;

  // const parentSelect = document.querySelector(
  //   `#metadata-form-${i} select[name="parentId"]`
  // );
  // if (parentSelect !== null) {
  //   const dataAttrs = $(parentSelect).find(':selected').data();
  //   if (dataAttrs !== undefined) {
  //     metadata.parent_model = dataAttrs.namespace;
  //     metadata.parent_id = parentSelect.value;
  //   }
  // }

  return metadata;
}

const makeUploadPromise = (metadata) => {
  const formData = new FormData();
  Object.entries(metadata).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return fetch('/api/media/upload', {
    method: 'POST',
    body: formData,
  });
}

const resolveUploadPromises = promises => {
  const promiseResponses = [];
  Promise.all(promises)
    .then(
      responsesAll => {
        responsesAll.forEach(responseAll => {
          if(responseAll.ok){
            promiseResponses.push(responseAll.json())
          }
        })
      },
      e1 => console.log(e1)
    )
    .then(() => {
      Promise.all(promiseResponses).then(responses => {
        responses.forEach(response => handleUploadResponse(response))
      })
    })
}

const handleUploadResponse = ({data, errors}) => {
  removeValidationErrors();
  const fileRow = document
    .querySelector(`.file-row[data-name="${data.filename}"]`);

  if(!errors){
    handleSuccessResponse(fileRow, data)
  }else if(fileRow){
    handleErrorResponse(fileRow, errors)
  }
}

const removeValidationErrors = () => {
  document
    .querySelectorAll('small.text-danger')
    .forEach(err => err.remove());
}

const handleSuccessResponse = (row, {msg, success}) => {
  const fileLoader = row.querySelector(
    'span.loader-container'
  );

  fileLoader.classList.value = 'ml-2';
  fileLoader.innerHTML = success ? '✅' : '❌';

  const textClass = success ? 'success' : 'danger';
  row.querySelector('.card-header').innerHTML += templates.uploadFeedback(msg, textClass);
}

const handleErrorResponse = (row, errors) => {
  Object.entries(errors).forEach(([name, errors]) => {
    const field = row.querySelector(
      `input[name="${name}"], select[name="${name}"]`
    );
    errors.forEach(error => {
      field.parentElement.innerHTML += `<small class="text-danger">${error}</small>`;
    });
  });

  const fileLoader = row.querySelector(
    'span.loader-container'
  );

  fileLoader.innerHTML = '❌';
  row.querySelector('.card-header').innerHTML += `
    <p class="mt-2 mb-0 text-danger text-center">
      The provided metadata is invalid
    </p>
  `;

  // $(row).find('.collapse').collapse('show');
}

const initCrop = () => {
  $('.crop-btn')
    .unbind()
    .click(e1 => {
      const i1 = e1.target.dataset.id;
      const imageCropper = document.querySelector(`#imageCropper_${i1}`);
      initCropper(i1);
      if (Object.values(imageCropper.classList).includes('d-none')) {
        imageCropper.classList.remove('d-none');
      } else {
        imageCropper.classList.add('d-none');
      }
    });
}

const initCropper = i => {
  const imgTobeCrop = document.querySelector(`.to_be_crop_${i}`);
  const ImgCrop = new Cropper(imgTobeCrop, {
    aspectRatio: '1/1',
  });

  const buttonConfirm = document.querySelector(`#crop_btn_${i}`);

  buttonConfirm.addEventListener('click', () => {
    const canvas = ImgCrop.getCroppedCanvas();
    if (canvas !== null) {
      canvas.toBlob(blob => {
        blob.lastModifiedDate = new Date();
        blob.lastModified = new Date();

        const croppedImage = new File([blob], globalUploadList[i].media.name, {
          type: blob.type,
        });

        globalUploadList[i].media = croppedImage;
        document.querySelector(`#image-preview-${i}`).src =
          URL.createObjectURL(croppedImage);
        $(`#crop-btn-${i}`).click();
        toast('Image cropped with success');
      });
    }
  });
}

export default { init };