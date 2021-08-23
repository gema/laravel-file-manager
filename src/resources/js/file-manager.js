const {apiRequest, truncate} = require('./utils');

let globalTags = [];
let globalMediaTypes = [];
let globalParents = {};

const toggleLoader = (prefix, show = true) => {
    document.querySelector(`${prefix}.selection-area`).innerHTML = '';
    const loader = document.querySelector(`${prefix}.media-loader`);
    show ? loader.classList.remove('d-none') : loader.classList.add('d-none');
}

const getSelectedTags = (prefix) => {
    const tagsIds = [];
    document.querySelectorAll(`${prefix} .selected .select-tag`).forEach(tagBtn => {
        tagsIds.push(parseInt(tagBtn.dataset.tag));
    });
    return tagsIds;
}

const toggleTagBtn = (parent) => {
    const isSelected = Object.values(parent.classList).includes('selected');
    isSelected ? 
        parent.classList.remove('selected') : 
        parent.classList.add('selected');
}

const initTagsModal = (prefix, title) => {
    const modal = document.querySelector('#asign-tag-modal');
    
    const selectedMedias = getSelectedMedias(prefix);

    if(selectedMedias.length){
        modal.querySelector('.modal-title').textContent = title;
        const options = globalTags.map(tag => `
            <option value="${tag.id}">
                ${tag.name}
            </option>
        `)

        modal.querySelector('.modal-body').innerHTML =  `
            <select name="tags" class="asign-tags-select form-control">
                ${options}
            </select>
        `;

        $(modal).modal('show');
        return modal;
    }else{
        toast(__('selectMediasFirst'), 'danger')
        return modal;
    }
}

const initUnsignTag = (prefix) => {
    // Asign Tag to medias
    document.querySelector(`${prefix}#unsign-tag-button`).addEventListener('click', e => {
        
        const modal = initTagsModal(prefix, __('removeTag'));
        
        const saveBtn = $(`#asign-tag-modal .modal-save`);
        saveBtn.unbind('click');
        saveBtn.on('click', e => {
            const tags = [modal.querySelector('.asign-tags-select').value];
            const unsignData = {
                tags,
                medias : selectedMedias
            }

            const formData = new FormData();
            Object.entries(unsignData).forEach(([key, value]) => {
                formData.append(key, value);
            })

            fetch(`/api/media/tag/unsign`, {
                method : 'POST',
                body : formData
            })
            .then(r=>r.json())
            .then(response => {
                if(response.data > 0){
                    toast(__('tagsUnsigned'))
                    $(modal).modal('hide');
                }
                else toast(__('tagsUnsignedError'), 'danger')
            })
            .catch(e => console.log(e))
        })
    })
}

const initAsignTag = (prefix) => {
    // Asign Tag to medias
    document.querySelector(`${prefix}#asign-tag-button`).addEventListener('click', e => {
        const modal = initTagsModal(prefix, __('asignTag'));
        
        const saveBtn = $(`#asign-tag-modal .modal-save`);
        saveBtn.unbind('click');
        saveBtn.on('click', e => {
            const tags = [modal.querySelector('.asign-tags-select').value];
            const asignData = {
            tags,
            medias : selectedMedias
            }

            const formData = new FormData();
            Object.entries(asignData).forEach(([key, value]) => {
                formData.append(key, value);
            })

            fetch(`/api/media/tag`, {
                method : 'POST',
                body : formData
            })
            .then(r=>r.json())
            .then(response => {
                if(response.data){
                    toast(__('tagsAsigned'))
                    $(modal).modal('hide');
                }
                else toast(__('tagsAsignedError'), 'danger')
            })
            .catch(e => console.log(e))
        })
    })
}

const initTags = (prefix = '', type = false) => {
    const tagsContainer = document.querySelector(`${prefix}.tags-container ul`);
    tagsContainer.innerHTML = '';
    globalTags.forEach(tag =>{
        tagsContainer.innerHTML += `
            <li class="list-group-item">
                <a href="#" title="${tag.name}" class="select-tag" data-tag="${tag.id}">
                    ${truncate(tag.name, 10)}
                </a>
            </li>
        `;
    })

    initAsignTag(prefix);
    initUnsignTag(prefix);

    // Toggle and refresh media list (filter by tag)
    document.querySelectorAll(`${prefix}.select-tag`).forEach(tagBtn => {
        tagBtn.addEventListener('click', e => {
            toggleTagBtn(e.currentTarget.parentNode);
            const selectedTags = getSelectedTags(prefix);

            toggleLoader(prefix, true);
    
            getMedias(1, selectedTags, type, (medias) => {
                renderMediasTable(medias, prefix)
            })
        })
    })
}

const toast = (text, type = 'success') => {
    new Noty({
        type,
        text
    }).show();
}

const getSelectedMedias = (prefix) => {
    selectedMedias = [];
    document.querySelectorAll(`${prefix}.selectable.selected`).forEach(selectable => {
        selectedMedias.push(selectable.dataset.file);
    })
    return selectedMedias;
}

const initSelectedMediasEdition = (prefix, medias, type) => {
    document.querySelectorAll(`${prefix}.selected-media`).forEach(element => {

        element.addEventListener('click', e => {
            const mediaId = e.currentTarget.dataset.media;
            const [media] = medias.filter(m => String(m.id) === mediaId);

            const modal = document.querySelector('#edit-media-modal')
            modal.querySelector('.modal-body').innerHTML = metadataFormTemplate(globalMediaTypes, media.id )
            
            modal.querySelector('.modal-save').innerHTML = 'Save';

            const parentField = modal.querySelector('select[name="parentId"]')
            if(parentField !== null) parentField.value = media ? media.parent_id : '';
            
            const titleField = modal.querySelector('input[name="title"]')
            titleField.value = media.media_content ? media.media_content.title : '';
            
            const descriptionField = modal.querySelector('textarea[name="description"]');
            descriptionField.value = media.media_content ? media.media_content.description : '';

            // modal.querySelector('select[name="type"]').value = media.type;
            
            modal.querySelector('.modal-save').addEventListener('click', e => {
                const mediaData = {
                    title : modal.querySelector('input[name="title"]').value,
                    description : modal.querySelector('textarea[name="description"]').value,
                }

                if(parentField !== null) mediaData.parent = modal.querySelector('select[name="parentId"]').value;

                const formData = new FormData();
                Object.entries(mediaData).forEach(([key, value]) => {
                    formData.append(key, value);
                })

                fetch(`/api/media/${media.media_content.id}/edit`, {
                    method : 'POST',
                    body : formData
                })
                .then(r=>r.json())
                .then(data => {
                    modal.querySelectorAll('small.text-danger').forEach(err => err.remove())

                    if(!data.errors && data.data.updated){
                        document
                            .querySelector(`${prefix}.selected-media[data-media="${media.id}"]`)
                            .outerHTML = selectedMediaTemplate(data.data.media)

                            modal.querySelector('.modal-save').innerHTML = `<span class="modal-loader la la-spinner la-spin"></span>`;

                            toggleLoader(prefix, true);
                            getMedias(1, '', type, (medias) => {
                                initSelectedMediasEdition(prefix, medias.data, type)
                                renderMediasTable(medias, prefix, type)
                                $(modal).modal('hide');
                                toast(__('mediaUpdated'))
                            });
                    }else{
                        Object.entries(data.errors).forEach(([name, errors]) => {
                            const field = modal.querySelector(`input[name="${name}"], textarea[name="${name}"], select[name="${name}"]`)
                            errors.forEach(error => {
                                field.parentElement.innerHTML += `<small class="text-danger">${error}</small>`;
                            })
                        })
                    }
                })
            })

            $(modal).modal('show');
        })
    })
}

const selectedMediaTemplate = (media) => {
    return `
    <a href="#" data-media="${media.id}" class="selected-media list-group-item list-group-item-action flex-column align-items-start">
        <div class="d-flex w-100 justify-content-between">
            <div>
                <b class="mb-1 m-0">${media.media_content ? media.media_content.title : media.name}</b></br>  
                <small class="mb-1">${media.media_content ? media.media_content.description : __('noDescription')}</small>
            </div>
            <div>
                <img src="${media.media_content.preview}">
            </div>
        </div>
    </a>
`
}

const initSelection = (medias, prefix, type) => {
    const selection = new SelectionArea({
        boundaries: ['html'],
        selectables: ['.selection-area > .selectable']
    }).on('start', ({store, event}) => {
        if (!event.ctrlKey && !event.metaKey) {
    
            for (const el of store.stored) {
                el.classList.remove('selected');
            }
    
            selection.clearSelection();
        }
    }).on('move', ({store: {changed: {added, removed}}}) => {
        for (const el of added) {
            el.classList.add('selected');
        }
    
        for (const el of removed) {
            el.classList.remove('selected');
        }
    });

    if(prefix !== ''){
        document.querySelector(`${prefix}#selectFilesBtn`).addEventListener('click', () => {
            const selectedMedias = getSelectedMedias(prefix);
            document.querySelector(`${prefix} .selected-medias-input`)
                .value =JSON.stringify({ medias : selectedMedias})

            const selectedMediasContainer = document.querySelector(`${prefix}.selected-medias-list`);
            selectedMediasContainer.innerHTML = '';

            document.querySelector(`${prefix}.selected-medias-number`).innerHTML = `
                ${selectedMedias.length}
            `;
            
            if(selectedMedias.length > 0){
                medias.forEach(media => {
                    if(selectedMedias.includes(String(media.id))){
                        selectedMediasContainer.innerHTML += selectedMediaTemplate(media); 
                    }
                })

                initSelectedMediasEdition(prefix, medias, type);
            }else{
                selectedMediasContainer.innerHTML = `
                    <li class="list-group-item">
                        <small>${__('noMediasSelected')}</small>
                    </li>
                `;
            }
        })
    }
    
}

const mediaItemTemplate = media => {
    return `
    <div title="${media.media_content.title}" class="selectable col-md-2 col-sm-3 m-1" data-file="${media.id}">
        <img src="${media.media_content.preview}">
        <small>${truncate(media.media_content.title, 10)}</small>
    </div>
    `;
}

const initScroll = (container, lastPage, prefix = '', type) => {
    let page = 1;
    let isLoading = false;
    
    $(container).unbind('scroll');
    $(container).on('scroll', e => {
        if(container.offsetHeight + container.scrollTop >= container.scrollHeight - 1){
            if(!isLoading && (page+1 <= lastPage)){
                page +=  1;
                isLoading = true;

                container.innerHTML += `
                <div class="pagination-loader col-sm-12 d-flex justify-content-center m-0">
                    <h4><span class="la la-spinner la-spin mt-3"></span></h4>
                </div>`;

                getMedias(page, getSelectedTags(prefix), type, (mediasResponse) => {
                    container.querySelector('.pagination-loader').remove();
                    const medias = mediasResponse.data;
                    medias.forEach(media => {
                        container.innerHTML += mediaItemTemplate(media);
                    })

                    isLoading = false;
                    if(prefix !== '') initSelection(medias, prefix, type);
                })
            }
        }   
    })
}

const renderMediasTable = (medias, prefix, type) => {
    toggleLoader(prefix, false);
    const container = document.querySelector(`${prefix} .custom-file-manager .list`);
    container.innerHTML = '';
    
    if(medias.data.length){
        medias.data.forEach(media => {
            // const tags = globalTags.filter(tag => media.tags.includes(tag.id));
            container.innerHTML += mediaItemTemplate(media);

            initScroll(container, medias.last_page, prefix, type);
            initSelection(medias.data, prefix, type);
        });
    } else {
        container.innerHTML = `<tr><td class="empty" colspan="6">${__('noMediasFound')}</td></tr>`
    }
}

const getMedias = (page = 1, tags=null, type = false, callback = false) => {
    apiRequest(`/admin/media/fetch/media?page=${page}`, mediasResponse => {
        callback(mediasResponse)
    }, 'POST', {  _token : document.querySelector('meta[name=csrf-token]').content, tags, type });
}

const  loadGlobals = (callback = false) => {
    toggleLoader('', true);

    apiRequest('/admin/file-manager/api/mediaTag/ajax/search', tagsResponse => {
        globalTags = tagsResponse.data;
        apiRequest('/admin/file-manager/api/mediaType/ajax/search', typesResponse => {
            globalMediaTypes = typesResponse.data;
            apiRequest('/admin/media/fetch/parent', parentsResponse => {
                Object.entries(parentsResponse.data).forEach(([entity, response]) => {
                    const parentList = {};
                    Object.values(response.data).forEach(parent => {
                        parentList[parent.id] = parent.name || parent.title || parent.label || parent.slug
                    })
                    globalParents[entity] = parentList
                })

                if(callback) callback();
            }, 'POST', { 
                _token : document.querySelector('meta[name=csrf-token]').content, 
            });  
        });            
    })
}

const initRefresh = (prefix = '', type = false) => {
    document.querySelector(`${prefix}#refreshBtn`)
        .addEventListener('click', e => {
            toggleLoader(prefix, true);
            getMedias(1, '', type, (medias) => {
                renderMediasTable(medias, prefix, type);
            })
        });
}

const mediaUploadPromise = (media, metadata) => {
    const formData = new FormData();
    formData.append('media', media.media);
    formData.append('cropped', media.cropped ? media.cropped : null);
    formData.append('name', media.media.name);

    Object.entries(metadata).forEach(([key, value]) => formData.append(key, value))

    return fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
    });
}

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
        </select></div>`;
}

const metadataFormTemplate = (types, i) => {

    let select = `
        <div class="form-group">
            <label>${__('parent')}</label>
            <select id="parent-select-${i}" class="select2-parent" name="parentId" style="width:100%">
            </select>
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
    </form>`
}

const cropImageTemplate = (media, i) => {

    const tmpImg = document.createElement('img');
    tmpImg.classList.add('to_be_crop_' + i);
    tmpImg.style.maxWidth = '100%';
    tmpImg.src = URL.createObjectURL(media);

    var buttonConfirm = document.createElement('button');
    buttonConfirm.textContent = 'Confirm';
    buttonConfirm.classList.add('confirm-crop');
    buttonConfirm.classList.add('btn');
    buttonConfirm.classList.add('btn-default');
    buttonConfirm.classList.add('btn-sm');
    buttonConfirm.id = "crop_btn_" + i;
    buttonConfirm.dataset.id = i;

    return `<div class="d-none" id="imageCropper_${i}">
                ${buttonConfirm.outerHTML}
                ${tmpImg.outerHTML}
            </div>`
}

const renderUploadMediaList = (medias, types) => {

    const mediasList = document.querySelector('#upload-modal .medias-list');
    mediasList.innerHTML = '';
    let i = 0;

    medias.forEach(media => {
        media = media.media;

        let mediaTemplate = '';
        let hasVideo = false;
        let hasAudio = false;

        const typesWithoutPreview = [
            'video/avi'
        ]

        if (typesWithoutPreview.includes(media.type)) {
            mediaTemplate = `<small>${__('noPreview', [media.type])}</small>`
        }
        else if (/^image/.test(media.type)) {
            if (media.type !== 'image/gif') {
                const cropBtn = `
                    <button id="crop-btn-${i}" class="form-control btn btn-default btn-sm crop-btn" data-id="${i}">
                        ${__('crop')}
                    </button>`;
        
                mediaTemplate = `
                    <img id="image-preview-${i}" class="w-100 my-3" src="${URL.createObjectURL(media)}">
                    ${cropBtn}
                    <div class="mt-1" id="crop_image_${i}">
                        ${cropImageTemplate(media, i)}
                    </div>
                `;
            } else {
                mediaTemplate = `
                    <img id="image-preview-${i}" class="w-100 my-3" src="${URL.createObjectURL(media)}">
                `;
            }
            
        } else if (/^video/.test(media.type)) {
            hasVideo = true;
            mediaTemplate = `
                <video controls id="video-preview-video-${i}" class="w-100 my-3">
                    <source id="video-preview-source-${i}" src="splashVideo">
                    Your browser does not support the video tag.
                </video>`; 
        }
        else if (/^audio/.test(media.type)) {
            hasAudio = true;
            mediaTemplate = `
            <audio class="w-100 my-3" id="audio-preview-audio-${i}" controls>
                <source src="" id="audio-preview-source-${i}" />
            </audio>`; 
        }

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
                            >${media.name} <small>${media.size} KB</small> <span class="loader-container"></span>
                            </button>
                            <a href="#" style="float:right" class="text-danger">
                                <i style="vertical-align:middle" data-name="${media.name}" class="remove-media-btn las la-trash-alt"></i>
                            </a>
                        </h5>
                    </div>
                    <div
                        id="collapse_${i}" 
                        class="collapse"
                        aria-labelledby="heading_${i}"
                        data-parent="#accordion">   
                        <div class="card-body">
                            ${mediaTemplate}
                            ${metadataFormTemplate(types, i)}
                        </div>
                    </div>
                </div>`;
        
        if (hasVideo) {
            const reader = new FileReader();
            const x = i;
            reader.onloadend = () => {
                const video = document.querySelector(`#video-preview-video-${x}`);
                video.src = reader.result;
            }

            reader.readAsDataURL(media)
        }

        if (hasAudio) {
            document.querySelector(`#audio-preview-source-${i}`).src = URL.createObjectURL(media);
            document.querySelector(`#audio-preview-audio-${i}`).load();
        }

        const finished = [];
        const x = i;
        $(`#parent-select-${i}`).select2({
            ajax: {
                url: '/api/media/parent',
                dataType: 'json',
                processResults: function ({ data }) {
                    const parentsNumber = Object.keys(data).length;
                    const results = [];
                    let more;

                    if (parentsNumber > 1) {
                        Object.entries(data).forEach(([namespace, response]) => {
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
                                            i:x
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
                                    i:x
                                })
                            })
                            more = response.current_page < response.last_page;
                        })
                    }

                    return {
                        results,
                        pagination: {more}
                    }
                    
                },
                data: (params) => {
                    const query = {
                      search: params.term,
                      page: params.page || 1
                    }

                    return query;
                  }
            }
        }).on('select2:select', e => {
            const data = e.params.data;
            $(`#parent-select-${data.i}`).children()[0].dataset.namespace = data.namespace;
        });

        i += 1;
    });
}

const initCropper = (i) => {
    const imgTobeCrop = document.querySelector('.to_be_crop_' + i);
    let ImgCrop = new Cropper(imgTobeCrop, {
        aspectRatio: '1/1'
    });

    const buttonConfirm = document.querySelector('#crop_btn_' + i);

    buttonConfirm.addEventListener('click', function (e) {

        let canvas = ImgCrop.getCroppedCanvas();
        if (canvas !== null) {
            canvas.toBlob(function (blob) {
                blob.lastModifiedDate = new Date();
                blob.lastModified = new Date();
    
                const croppedImage = new File([blob], mediaList[i].media.name, {
                    type: blob.type,
                });
    
                mediaList[i].media = croppedImage;
                document.querySelector(`#image-preview-${i}`).src = URL.createObjectURL(croppedImage);
                $(`#crop-btn-${i}`).click();
                toast(__('imageCropped'))
            });   
        }
    });
}

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
            medias = medias.filter(media => {
                return media.media.name != mediaName;
            });

            initUploadModal(medias, types);
        });
    })

    $('#upload-modal .modal-save').unbind().click(e => {
        e.currentTarget.classList.add('d-none');
        const promises = [];
        const promiseResponses = [];

        let i = 0;

        const fileNames = document.querySelectorAll('span.loader-container');
        fileNames.forEach(fileName => fileName.innerHTML += `<span class="ml-2 la la-spinner la-spin"></span>`)

        medias.forEach(media => {
            const metadataFields = document.querySelectorAll(`#metadata-form-${i} .form-control`);
            const metadata = {};
            metadataFields.forEach(field => metadata[field.name] = field.value);

            const parentSelect = document.querySelector(`#metadata-form-${i} select[name="parentId"]`);
            if (parentSelect !== null) {
                let dataAttrs = $(parentSelect).find(':selected').data();
                if (dataAttrs !== undefined) {
                    metadata.parent_model = dataAttrs.namespace
                }
                
            }

            promises.push(mediaUploadPromise(media, metadata))
            i += 1;
        });

        Promise.all(promises)
            .then(responses => {
                responses.forEach(
                    response => {
                        if (response.ok) {
                            promiseResponses.push(response.json())
                        }
                    })
            },
                e => {
                    console.log({ e })
                }
            )
            .then(() => {
                Promise.all(promiseResponses)
                    .then(responses => {
                        responses.forEach(response => {
                            const fileRow = document.querySelector(`.file-row[data-name="${response.data.filename}"]`);
                            document.querySelectorAll('small.text-danger').forEach(err => err.remove())

                            if(!response.errors){
                                const { msg, success } = response.data;
                                const fileLoader = fileRow.querySelector('span.loader-container');

                                fileLoader.classList.value = 'ml-2';
                                fileLoader.innerHTML = success ? '✅' : '❌';

                                fileRow.querySelector('.card-header').innerHTML += `
                                    <p class="mt-2 mb-0 text-${success ? 'success' : 'danger'} text-center">
                                        ${msg}
                                    </p>
                                `;
                            }else if(fileRow){
                                Object.entries(response.errors).forEach(([name, errors]) => {
                                    const field = fileRow.querySelector(`input[name="${name}"], select[name="${name}"]`)
                                    errors.forEach(error => {
                                        field.parentElement.innerHTML += `<small class="text-danger">${error}</small>`;
                                    })
                                })

                                const fileLoader = fileRow.querySelector('span.loader-container');
                                fileLoader.innerHTML ='❌';
                                fileRow.querySelector('.card-header').innerHTML += `
                                    <p class="mt-2 mb-0 text-danger text-center">
                                        ${__('invalidMetadata')}
                                    </p>
                                `;
                            }
                            
                        })
                    })
            })
    })

    $('.crop-btn').unbind().click(e => {
        const i = e.target.dataset.id;
        const imageCropper = document.querySelector('#imageCropper_' + i);
        initCropper(i);
        if(Object.values(imageCropper.classList).includes('d-none')){
            imageCropper.classList.remove('d-none');
        }else{
            imageCropper.classList.add('d-none');
        }
    });
}

let modalShown = false;
let mediaList = [];

const initUpload = (prefix) => {
    const hiddenInput = document.querySelector(`${prefix} #upload-field`);
    const uploadButton = document.querySelector(`${prefix} #upload-button`);
    
    const uploadModal = $('#upload-modal');

    const uploadClickListener =  e => {
        hiddenInput.value = '';
        hiddenInput.click();
    }

    $(uploadButton).unbind('click');
    $(uploadButton).on('click', uploadClickListener);

    hiddenInput.addEventListener('change', e => {
        mediaList = [];
        hiddenInput.files.forEach(media => mediaList.push({media, cropped: null}))
        if (!modalShown) {
            uploadModal.modal('show');
            modalShown = true;
        }
    });
}

const initMediaButton = (prefix) => {
    const buttonContainer = document.querySelector(`${prefix}.browse-media-btn-container`);
    const button = buttonContainer.querySelector('.filemanager-toggle');
    const loader = buttonContainer.querySelector('.la-spinner');

    button.disabled = false;
    loader.remove();
}

const initMediaField = (medias, prefix, type) => {
    renderMediasTable(medias, prefix, type);
    initSelectedMediasEdition(prefix, medias.data, type);

    const loadedEvent = new Event('medias-loaded');
    document.querySelector(`${prefix} #filemanager-container`).dispatchEvent(loadedEvent);

    initTags(prefix, type);
    initRefresh(prefix, type);
    initUpload(prefix);
    initUploadModalHandler(prefix, type);
    initMediaButton(prefix);
}

const onMediaLoadedSingle = (medias) => {
    renderMediasTable(medias, '');
    initTags();
    initRefresh();
    initUpload('');
    initUploadModalHandler();
}

const initUploadModalHandler = (prefix = '', type = false) => {
    const uploadModal = $('#upload-modal');
    uploadModal.on('shown.bs.modal', e => initUploadModal(mediaList, globalMediaTypes));
    uploadModal.on('hidden.bs.modal', e => {
        modalShown = false
        // Refresh After Upload
        toggleLoader(prefix, true);
        getMedias(1, '', type, medias => {
            renderMediasTable(medias, prefix, type);
        })
    });
}

const onGlobalsLoaded = () => {
    //Render upload modal
    const modalTemplate = document.querySelector('template.upload-modal');
    const node = modalTemplate.content.cloneNode(true);
    document.body.appendChild(node);


    // Init each field
    const fileManagerFields = document.querySelectorAll('.filemanager-field.modal-dialog');
    if(fileManagerFields.length){
        fileManagerFields.forEach(fileManagerField => {
            const name = fileManagerField !== null ? fileManagerField.getAttribute('name') : false;
            const prefix = name ? `.filemanager-field[name="${name}"] ` : '';
            const type = fileManagerField.dataset.type;
            getMedias(1, '', type, medias => {
                initMediaField(medias, prefix, type);
            })
            
        });
    }else{
        getMedias(1, '', false, medias => {
            onMediaLoadedSingle(medias)
        })
    }
}

const init = () => {
    loadGlobals(onGlobalsLoaded);
}

module.exports = {init};