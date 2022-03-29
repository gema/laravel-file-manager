/* eslint-disable no-use-before-define */
/* eslint-disable operator-linebreak */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */
const Select2 = require('./select2');
const { request, truncate, toast, arrayUniqueByKey } = require('./utils');
const { templates } = require('./templates');

let globalMedias = [];
let globalTags = [];
let globalTagsLastPage = 1;
let globalMediaTypes = [];
let globalParents = [];
let modalShown = false;
let mediaList = [];

const toggleLoader = (prefix, show = true) => {
  const container = document.querySelector(`${prefix}.selection-area`);
  if (container) {
    container.innerHTML = '';
    const loader = document.querySelector(`${prefix}.media-loader`);
    loader.classList.toggle('d-none', !show);
  }
};

const getSelectedTags = prefix => {
  const tagsIds = [];
  document
    .querySelectorAll(`${prefix} .selected .select-tag`)
    .forEach(tagBtn => tagsIds.push(parseInt(tagBtn.dataset.tag, 10)));
  return tagsIds;
};

const toggleTagBtn = parent => {
  const isSelected = Object.values(parent.classList).includes('selected');
  parent.classList.toggle('selected', !isSelected);
};

const getSelectedMedias = prefix => {
  selectedMedias = [];
  document
    .querySelectorAll(`${prefix}.selectable.ui-selected`)
    .forEach(selectable => {
      selectedMedias.push(selectable.dataset.file);
    });
  return selectedMedias;
};

const initTagsModal = (prefix, title) => {
  const modal = document.querySelector('#asign-tag-modal');
  const selectedMedias = getSelectedMedias(prefix);

  if (selectedMedias.length) {
    modal.querySelector('.modal-title').textContent = title;
    // modal.querySelector('.modal-body').innerHTML = templates.tagsSelect(globalTags);
    
    Select2.createAjaxField({
      container: modal.querySelector('.modal-body'),
      id: 'tags-modal-select',
      name: 'tags',
      label: 'tags',
      url: '/admin/media/fetch/tags',
      class: 'form-control tags-select',
    });

    Select2.initAjaxField('tags-modal-select');

    $(modal).modal('show');
    return modal;
  }

  toast(__('selectMediasFirst'), 'danger');
  return modal;
};

const initUnsignTag = prefix => {
  $(`${prefix}#unsign-tag-button`)
    .off('click')
    .on('click', () => {
      const modal = initTagsModal(prefix, __('removeTag'));

      const saveBtn = $('#asign-tag-modal .modal-save');
      saveBtn.off('click');
      saveBtn.on('click', () => {
        const tags = [modal.querySelector('.tags-select').value];
        const unsignData = {
          tags,
          medias: selectedMedias,
        };

        const formData = new FormData();
        Object.entries(unsignData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        fetch('/api/media/tag/unsign', {
          method: 'POST',
          body: formData,
        })
          .then(r => r.json())
          .then(response => {
            if (response.data > 0) {
              toast(__('tagsUnsigned'));
              $(modal).modal('hide');
            } else toast(__('tagsUnsignedError'), 'danger');
          })
          .catch(e => console.log(e));
      });
    });
};

const initAsignTag = prefix => {
  $(`${prefix}#asign-tag-button`)
    .off('click')
    .on('click', () => {
      const modal = initTagsModal(prefix, __('asignTag'));

      const saveBtn = $('#asign-tag-modal .modal-save');
      saveBtn.off('click');
      saveBtn.on('click', () => {
        const tags = [modal.querySelector('.tags-select').value];
        const asignData = {
          tags,
          medias: selectedMedias,
        };

        const formData = new FormData();
        Object.entries(asignData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        fetch('/api/media/tag', {
          method: 'POST',
          body: formData,
        })
          .then(r => r.json())
          .then(response => {
            if (response.data) {
              toast(__('tagsAsigned'));
              $(modal).modal('hide');
            } else toast(__('tagsAsignedError'), 'danger');
          })
          .catch(e => console.log(e));
      });
    })
};

const getMedias = (page = 1, tags = null, type = false, callback = false) => {
  request(`/admin/media/fetch/media?page=${page}`, callback, 'POST', {
    _token: document.querySelector('meta[name=csrf-token]').content,
    tags,
    type,
  });
};

const mediaItemTemplate = media => `
  <div
    title="${media.media_content.title}" 
    class="selectable col-md-2 col-sm-3 m-1" data-file="${media.id}">
    <img src="${media.media_content.preview}">
  </div>
`;

const mediaUploadPromise = (media, metadata) => {
  const formData = new FormData();
  formData.append('media', media.media);
  formData.append('cropped', media.cropped ? media.cropped : null);
  formData.append('name', media.media.name);

  Object.entries(metadata).forEach(([key, value]) => {
    formData.append(key, value);
  });

  return fetch('/api/media/upload', {
    method: 'POST',
    body: formData,
  });
};

const typesListTemplate = types => {
  let typesList = '';
  types.forEach(type => {
    typesList += `<option value="${type.id}">${type.name}</option>`;
  });

  return `
  <div class="form-group">
    <label>${__('mediaType')}</label>
    <select name="type" class="form-control">
      ${typesList}
    </select>
  </div>`;
};

const metadataFormTemplate = (types, i) => {
  const select = `
    <div id="select2-container-${i}" class="form-group">
      
    </div>
  `;

  return `
  <form id="metadata-form-${i}">
    ${select}
    <div class="form-group">
      <label>${__('title')}</label>
      <input name="title" type="text" class="form-control">
    </div>
    <div class="form-group">
      <label>${__('description')}</label>
      <textarea name="description" class="form-control"></textarea>
    </div>
    ${typesListTemplate(types)}
  </form>`;
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

const renderUploadMediaList = (medias, types) => {
  console.log({medias, types})
  const mediasList = document.querySelector('#upload-modal .medias-list');
  mediasList.innerHTML = '';
  let i = 0;

  medias.forEach(({media, is3d}) => {
    // media = media.media;

    let mediaTemplate = '';
    let hasVideo = false;
    let hasAudio = false;

    const typesWithoutPreview = ['video/avi'];

    if (typesWithoutPreview.includes(media.type)) {
      mediaTemplate = `<small>${__('noPreview', [media.type])}</small>`;
    } else if (/^image/.test(media.type)) {
      if (media.type !== 'image/gif') {
        const cropBtn = `
          <button id="crop-btn-${i}" class="form-control btn btn-default btn-sm crop-btn" data-id="${i}">
            ${__('crop')}
          </button>`;

        mediaTemplate = `
          <img
            id="image-preview-${i}" 
            class="w-100 my-3"
            src="${URL.createObjectURL(media)}">
          ${cropBtn}
          <div class="mt-1" id="crop_image_${i}">
            ${cropImageTemplate(media, i)}
          </div>
        `;
      } else {
        mediaTemplate = `
          <img
            id="image-preview-${i}" 
            class="w-100 my-3"
            src="${URL.createObjectURL(media)}">
        `;
      }
    } else if (/^video/.test(media.type)) {
      hasVideo = true;
      mediaTemplate = `
        <video controls id="video-preview-video-${i}" class="w-100 my-3">
          <source id="video-preview-source-${i}" src="">
          Your browser does not support the video tag.
        </video>`;
    } else if (/^audio/.test(media.type)) {
      hasAudio = true;
      mediaTemplate = `
      <audio class="w-100 my-3" id="audio-preview-audio-${i}" controls>
        <source src="" id="audio-preview-source-${i}" />
      </audio>`;
    } else if (is3d) {
      '<p>3d model</p>'
    }

    let mediaSize = media.size;
    let unit = '';
    let j = 0;
    const units = ['KB', 'MB', 'GB'];

    while (mediaSize > 1024 && j < units.length) {
      mediaSize = Math.round(mediaSize / 1024);
      unit = units[j];
      j += 1;
    }

    const metadataForm = templates.metadataForm(i, types, {media, is3d});

    mediasList.innerHTML += `
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
            <p class="mt-2 mb-0 text-center"></p>
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
            ${mediaTemplate}
            ${metadataForm}
          </div>
        </div>
      </div>`;

    if (hasVideo) {
      const reader = new FileReader();
      const x = i;
      reader.onloadend = () => {
        const video = document.querySelector(`#video-preview-video-${x}`);
        video.src = reader.result;
      };

      reader.readAsDataURL(media);
    }

    if (hasAudio) {
      document.querySelector(`#audio-preview-source-${i}`).src =
        URL.createObjectURL(media);
      document.querySelector(`#audio-preview-audio-${i}`).load();
    }

    const container = document.querySelector(`#select2-container-${i}`);
    if(globalParents.show){
      Select2.createGroupedField({
        container,
        name: 'parentId',
        label: globalParents.label,
        url: '/admin/media/fetch/parents',
        class: 'form-control',
      });
    }else if(globalParents.id){
      container.innerHTML += `
        <input type="text" value="${globalParents.id}" name="parentId">
        <input type="text" value="${globalParents.model}" name="parentModel">
      `;
    }
    

    i += 1;
  });

  if(globalParents.show) Select2.initGroupedFields();
};

const initSelectedMediasEdition = (prefix, medias, type) => {
  document.querySelectorAll(`${prefix}.selected-media`).forEach(element => {
    element.addEventListener('click', e => {
      const mediaId = e.currentTarget.dataset.media;
      const [media] = medias.filter(m => String(m.id) === mediaId);

      const modal = document.querySelector('#edit-media-modal');
      modal.querySelector('.modal-body').innerHTML = metadataFormTemplate(
        globalMediaTypes,
        media.id
      );

      modal.querySelector('.modal-save').innerHTML = 'Save';

      const parentField = modal.querySelector('select[name="parentId"]');
      if (parentField !== null) {
        parentField.value = media ? media.parent_id : '';
      }

      const titleField = modal.querySelector('input[name="title"]');
      titleField.value = media.media_content ? media.media_content.title : '';

      const descriptionField = modal.querySelector(
        'textarea[name="description"]'
      );
      descriptionField.value = media.media_content
        ? media.media_content.description
        : '';

      modal.querySelector('.modal-save').addEventListener('click', () => {
        const mediaData = {
          title: modal.querySelector('input[name="title"]').value,
          description: modal.querySelector('textarea[name="description"]')
            .value,
        };

        if (parentField !== null) {
          mediaData.parent = modal.querySelector(
            'select[name="parentId"]'
          ).value;
        }

        const formData = new FormData();
        Object.entries(mediaData).forEach(([key, value]) => {
          formData.append(key, value);
        });

        fetch(`/api/media/${media.media_content.id}/edit`, {
          method: 'POST',
          body: formData,
        })
          .then(r => r.json())
          .then(data => {
            modal
              .querySelectorAll('small.text-danger')
              .forEach(err => err.remove());

            if (!data.errors && data.data.updated) {
              document.querySelector(
                `${prefix}.selected-media[data-media="${media.id}"]`
              ).outerHTML = templates.selectedMedia(data.data.media);

              modal.querySelector('.modal-save').innerHTML =
                '<span class="modal-loader la la-spinner la-spin"></span>';

              toggleLoader(prefix, true);
              getMedias(1, '', type, medias1 => {
                initSelectedMediasEdition(prefix, medias1.data, type);
                // eslint-disable-next-line no-use-before-define
                renderMediasTable(medias1, prefix, type);
                $(modal).modal('hide');
                toast(__('mediaUpdated'));
              });
            } else {
              Object.entries(data.errors).forEach(([name, errors]) => {
                const field = modal.querySelector(
                  `input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`
                );
                errors.forEach(error => {
                  field.parentElement.innerHTML += `<small class="text-danger">${error}</small>`;
                });
              });
            }
          });
      });

      $(modal).modal('show');
    });
  });
};

const initSelection = (medias, prefix, type) => {
  $('.selection-area')
    .selectable();

  if (prefix !== '') {
    document
      .querySelector(`${prefix}#selectFilesBtn`)
      .addEventListener('click', () => {
        const selectedMedias = getSelectedMedias(prefix);
        let value;

        if (selectedMedias.length) {
          value = JSON.stringify({ medias: selectedMedias });
        } else {
          value = null
        }
        
        document.querySelector(`${prefix} .selected-medias-input`).value = value;

        const selectedMediasContainer = document.querySelector(
          `${prefix}.selected-medias-list`
        );
        selectedMediasContainer.innerHTML = '';

        document.querySelector(
          `${prefix}.selected-medias-number`
        ).innerHTML = `${selectedMedias.length}`;

        if (selectedMedias.length > 0) {
          medias.forEach(media => {
            if (selectedMedias.includes(String(media.id))) {
              selectedMediasContainer.innerHTML += templates.selectedMedia(media);
            }
          });

          initSelectedMediasEdition(prefix, medias, type);
        } else {
          selectedMediasContainer.innerHTML = `
            <li class="list-group-item">
              <small>${__('noMediasSelected')}</small>
            </li>
          `;
        }
      });
  }
};

const initScroll = (container, lastPage, prefix = '', type) => {
  let page = 1;
  let isLoading = false;

  $(container).off('scroll');
  $(container).on('scroll', () => {
    if (
      container.offsetHeight + container.scrollTop >=
      container.scrollHeight - 1
    ) {
      if (!isLoading && page + 1 <= lastPage) {
        page += 1;
        isLoading = true;

        container.innerHTML += `
        <div class="pagination-loader col-sm-12 d-flex justify-content-center m-0">
          <h4><span class="la la-spinner la-spin mt-3"></span></h4>
        </div>`;

        getMedias(page, getSelectedTags(prefix), type, mediasResponse => {
          container.querySelector('.pagination-loader').remove();
          const medias = mediasResponse.data;
          medias.forEach(media => {
            container.innerHTML += mediaItemTemplate(media);
          });

          globalMedias = arrayUniqueByKey(globalMedias.concat(medias), 'id');

          isLoading = false;
          if (prefix !== '') initSelection(globalMedias, prefix, type);
        });
      }
    }
  });
};

const renderMediasTable = (medias, prefix, type = false) => {
  globalMedias = arrayUniqueByKey(globalMedias.concat(medias.data), 'id');
  toggleLoader(prefix, false);
  const container = document.querySelector(
    `${prefix} .custom-file-manager .list`
  );
  container.innerHTML = '';

  if (medias.data.length) {
    medias.data.forEach(media => {
      // const tags = globalTags.filter(tag => media.tags.includes(tag.id));
      container.innerHTML += mediaItemTemplate(media);

      initScroll(container, medias.last_page, prefix, type);
      initSelection(globalMedias, prefix, type);
    });
  } else {
    container.innerHTML = `
    <tr>
      <td class="empty" colspan="6">${__('noMediasFound')}</td>
    </tr>`;
  }
};

const initRefresh = (prefix = '', type = false) => {
  document
    .querySelector(`${prefix}#refreshBtn`)
    .addEventListener('click', () => {
      toggleLoader(prefix, true);
      getMedias(1, '', type, medias => {
        renderMediasTable(medias, prefix, type);
      });
    });
};

const initTags = (prefix = '', type = false) => {
  const tagsContainer = document.querySelector(`${prefix}.tags-container ul`);
  tagsContainer.innerHTML = '';
  globalTags.forEach(tag => {
    tagsContainer.innerHTML += `
      <li class="list-group-item">
        <a href="#" title="${tag.name}" class="select-tag" data-tag="${tag.id}">
          ${truncate(tag.name, 10)}
        </a>
      </li>
    `;
  });

  initTagsPagination(tagsContainer.parentElement, globalTagsLastPage, prefix, type);

  initAsignTag(prefix);
  initUnsignTag(prefix);
  initTagsFilter(prefix, type);
};

const initTagsFilter = (prefix, type) => {
  document.querySelectorAll(`${prefix}.select-tag`).forEach(tagBtn => {
    tagBtn.addEventListener('click', e => {
      toggleTagBtn(e.currentTarget.parentNode);
      const selectedTags = getSelectedTags(prefix);

      toggleLoader(prefix, true);

      getMedias(1, selectedTags, type, medias => {
        renderMediasTable(medias, prefix);
      });
    });
  });
}

const initTagsPagination = (container, lastPage, prefix, type) => {
  let page = 1;
  let isLoading = false;

  $(container).off('scroll');
  $(container).on('scroll', () => {
    if (
      container.offsetHeight + container.scrollTop >=
      container.scrollHeight - 1
    ) {
      if (!isLoading && page + 1 <= lastPage) {
        page += 1;
        isLoading = true;

        container.innerHTML += '<span class="w-100 text-center tags-loader la la-spinner la-spin mt-3"></span>';
        getTags(page, ({ data }) => {
          document.querySelector('.tags-loader').remove();
          data.forEach(tag => {
            container.querySelector('ul').innerHTML += `
              <li class="list-group-item">
                <a href="#" title="${tag.name}" class="select-tag" data-tag="${tag.id}">
                  ${truncate(tag.name, 10)}
                </a>
              </li>
            `;
          });
          isLoading = false;
          initTagsFilter(prefix, type)
        });
      }
    }
  });
};

const getTags = (page = 1, callback = false) => {
  request(`/admin/media/fetch/tags?page=${page}`, callback, 'POST', {
    _token: document.querySelector('meta[name=csrf-token]').content,
  });
};

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

        const croppedImage = new File([blob], mediaList[i].media.name, {
          type: blob.type,
        });

        mediaList[i].media = croppedImage;
        document.querySelector(`#image-preview-${i}`).src =
          URL.createObjectURL(croppedImage);
        $(`#crop-btn-${i}`).click();
        toast(__('imageCropped'));
      });
    }
  });
};

const initUploadModal = (medias, types) => {
  const titleSpan = document.querySelector('#upload-modal .modal-title span');
  const button = document.querySelector('#upload-modal .modal-save');
  const buttonSpan = button.querySelector('span');
  const totalMedias = medias.length;

  renderUploadMediaList(medias, types);

  button.classList.remove('d-none');
  titleSpan.innerHTML = totalMedias;
  buttonSpan.innerHTML = totalMedias;

  const removeMediaBtns = document.querySelectorAll('.remove-media-btn');
  removeMediaBtns.forEach(removeBtn => {
    removeBtn.addEventListener('click', e => {
      const mediaName = e.target.dataset.name;
      medias = medias.filter(media => media.media.name !== mediaName);

      initUploadModal(medias, types);
    });
  });

  $('#upload-modal .modal-save')
    .off('click')
    .on('click', e => {
      e.currentTarget.classList.add('d-none');
      const promises = [];
      const promiseResponses = [];

      let i = 0;

      const fileNames = document.querySelectorAll('span.loader-container');
      fileNames.forEach(fileName => {
        fileName.innerHTML +=
          '<span class="ml-2 la la-spinner la-spin"></span>';
      });

      medias.forEach(media => {
        const metadataFields = document.querySelectorAll(
          `#metadata-form-${i} .form-control`
        );
        const metadata = {};
        metadataFields.forEach(field => (metadata[field.name] = field.value));

        const parentSelect = document.querySelector(
          `#metadata-form-${i} select[name="parentId"]`
        );
        if (parentSelect !== null) {
          const dataAttrs = $(parentSelect).find(':selected').data();
          if (dataAttrs !== undefined) {
            metadata.parent_model = dataAttrs.namespace;
            metadata.parent_id = parentSelect.value;
          }
        }

        const parentIdHidden = document.querySelector(`#metadata-form-${i} input[name="parentId"]`);
        const parentNamespaceHidden = document.querySelector(`#metadata-form-${i} input[name="parentModel"]`);

        if(parentIdHidden !== null && parentNamespaceHidden !== null){
          metadata.parent_id = parentIdHidden.value;
          metadata.parent_model = parentNamespaceHidden.value;
        }

        promises.push(mediaUploadPromise(media, metadata));
        i += 1;
      });

      Promise.all(promises)
        .then(
          responses => {
            responses.forEach(response => {
              if (response.ok) {
                promiseResponses.push(response.json());
              }
            });
          },
          e1 => console.log(e1)
        )
        .then(() => {
          Promise.all(promiseResponses).then(responses => {
            responses.forEach(response => {
              const fileRow = document.querySelector(
                `.file-row[data-name="${response.data.filename}"]`
              );
              document
                .querySelectorAll('small.text-danger')
                .forEach(err => err.remove());

              if (!response.errors) {
                const { msg, success } = response.data;
                const fileLoader = fileRow.querySelector(
                  'span.loader-container'
                );

                fileLoader.classList.value = 'ml-2';
                fileLoader.innerHTML = success ? '✅' : '❌';

                const textClass = success ? 'success' : 'danger';
                const feedback = fileRow.querySelector('.card-header p')
                feedback.textContent = msg;
                feedback.classList.remove('text-danger');
                feedback.classList.remove('text-success');
                feedback.classList.add(`text-${textClass}`);
              } else if (fileRow) {
                Object.entries(response.errors).forEach(([name, errors]) => {
                  const field = fileRow.querySelector(
                    `input[name="${name}"], select[name="${name}"]`
                  );
                  errors.forEach(error => {
                    field.parentElement.innerHTML += `<small class="text-danger">${error}</small>`;
                  });
                });

                const fileLoader = fileRow.querySelector(
                  'span.loader-container'
                );

                fileLoader.innerHTML = '❌';
                const feedback = fileRow.querySelector('.card-header p')
                feedback.innerHTML = __('invalidMetadata');
                feedback.classList.add('text-danger');
                feedback.classList.remove('text-success');

                $(fileRow).find('.collapse').collapse('show');
                e.currentTarget.classList.remove('d-none');
              }
            });
          });
        });
    });

  $('.crop-btn')
    .off('click')
    .on('click', e1 => {
      const i1 = e1.target.dataset.id;
      const imageCropper = document.querySelector(`#imageCropper_${i1}`);
      initCropper(i1);
      if (Object.values(imageCropper.classList).includes('d-none')) {
        imageCropper.classList.remove('d-none');
      } else {
        imageCropper.classList.add('d-none');
      }
    });
};

const initUploadModalHandler = (prefix = '', type = false) => {
  const uploadModal = $('#upload-modal');
  uploadModal.on('shown.bs.modal', () => {
    initUploadModal(mediaList, globalMediaTypes);
  });
  uploadModal.on('hidden.bs.modal', () => {
    modalShown = false;
    // Refresh After Upload
    toggleLoader(prefix, true);
    getMedias(1, '', type, medias => {
      renderMediasTable(medias, prefix, type);
    });
  });
};

const initUpload = prefix => {
  const hiddenInput = document.querySelector(`${prefix} #upload-field`);
  const uploadButton = document.querySelector(`${prefix} #upload-button`);

  const uploadModal = $('#upload-modal');

  const uploadClickListener = () => {
    hiddenInput.value = '';
    hiddenInput.click();
  };

  $(uploadButton).off('click');
  $(uploadButton).on('click', uploadClickListener);

  hiddenInput.addEventListener('change', () => {
    mediaList = [];
    hiddenInput.files.forEach(media => {
      const ext = media.name.split('.').pop();
      const ext3D = ['dae', 'abc', 'usd', 'usdc', 'usda', 'ply', 'stl', 'fbx', 'glb', 'gltf', 'obj', 'x3d'];
      mediaList.push({ media, cropped: null, is3d: ext3D.includes(ext) });
    });
    if (!modalShown) {
      uploadModal.modal('show');
      modalShown = true;
    }
  });
};

const initMediaButton = prefix => {
  const buttonContainer = document.querySelector(
    `${prefix}.browse-media-btn-container`
  );
  const button = buttonContainer.querySelector('.filemanager-toggle');
  const loader = buttonContainer.querySelector('.la-spinner');

  button.disabled = false;
  loader.remove();
};

const initMediaField = (medias, prefix, type) => {
  renderMediasTable(medias, prefix, type);
  initSelectedMediasEdition(prefix, medias.data, type);

  const loadedEvent = new Event('medias-loaded');
  document
    .querySelector(`${prefix} #filemanager-container`)
    .dispatchEvent(loadedEvent);

  // initTags(prefix, type);
  initRefresh(prefix, type);
  initUpload(prefix);
  initUploadModalHandler(prefix, type);
  initMediaButton(prefix);
};

const onMediaLoadedSingle = medias => {
  renderMediasTable(medias, '');
  // initTags();
  initRefresh();
  initUpload('');
  initUploadModalHandler();
};

const setGlobals = ({ data }) => {
  const { tags, types, parent } = data;
  globalTags = tags.data;
  globalTagsLastPage = tags.last_page;
  globalMediaTypes = types.data;
  globalParents = parent
};

const onGlobalsLoaded = response => {
  setGlobals(response);
  // Render upload modal
  const modalTemplate = document.querySelector('template.upload-modal');
  const node = modalTemplate.content.cloneNode(true);
  document.body.appendChild(node);
  // Init each field
  const fileManagerFields = document.querySelectorAll(
    '.filemanager-field.modal-dialog'
  );
  if (fileManagerFields.length) {
    fileManagerFields.forEach(fileManagerField => {
      const name =
        fileManagerField !== null
          ? fileManagerField.getAttribute('name')
          : false;
      const prefix = name ? `.filemanager-field[name="${name}"] ` : '';
      const { type } = fileManagerField.dataset;
      getMedias(1, '', type, medias => {
        initMediaField(medias, prefix, type);
      });
    });
  } else {
    getMedias(1, '', false, medias => {
      onMediaLoadedSingle(medias);
    });
  }
};

const init = () => {
  loadGlobals(onGlobalsLoaded);
};

const loadGlobals = (callback = false) => {
  toggleLoader('', true);
  request(
    '/admin/media/fetch/global-data',
    callback,
    'POST'
  );
};

module.exports = { init };
