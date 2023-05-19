/* eslint-disable no-use-before-define */

const { templates } = require("../templates");
const Select2 = require("../select2");
const { request, toast, customEvent } = require("../utils");

let globalTags;
let globalMediaTypes;
let globalOptions;
let globalUploadList;
let globalTagsLastPage;

let globalContainer;
let globalUploadContainer;
let globalMediaListContainer;
let globalTagsListContainer;
let globalParents;
let mediaType;
let extraFields;

const init = (options) => {
  globalOptions = options;
  mediaType = options.mediaType;
  extraFields = options.extraFields;
  loadGlobals(onGlobalsLoaded);
  window.addEventListener(`get_extensions_${globalOptions.name}`, (e) => {
    // allowedMedias = e.detail.extensions
    mediaType = e.detail.mediaType;
    extraFields = e.detail.extraFields;
  });
};

const loadGlobals = (callback = false) => {
  request("/admin/media/fetch/global-data", callback, "POST");
};

const toggleLoader = (visible) => {
  const container = globalContainer.querySelector(".selection-area");
  if (container) {
    container.innerHTML = "";
    const loader = globalContainer.querySelector(".media-loader");
    loader.classList.toggle("d-none", !visible);
  }
};

const onGlobalsLoaded = (globals) => {
  setGlobals(globals);
  if (globalContainer) loadMedias();
};

const setGlobals = ({ data }) => {
  const { tags, types, parent } = data;
  globalTags = tags.data;
  globalTagsLastPage = tags.last_page;
  globalMediaTypes = types.data;
  globalParents = parent;

  globalContainer = document.querySelector("#media-modal___BV_modal_outer_");
  if (globalContainer) {
    globalMediaListContainer = globalContainer.querySelector(
      ".custom-file-manager .list"
    );
    globalTagsListContainer =
      globalContainer.querySelector(".tags-container ul");
  } else {
    initSelectedMediaEdition();
    customEvent(`edit_media_${globalOptions.name}`, {
      mediaId: globalOptions.mediaId,
      medias: globalOptions.medias,
    });
  }
};

const loadMedias = () => {
  fetchMedias(
    {
      type: globalOptions.mediaType,
    },
    initMediaField
  );
};

const fetchMedias = ({ page, tags, type }, callback = false) => {
  if (page === undefined) page = 1;
  if (tags === undefined) tags = null;
  if (type === undefined) type = false;

  request(`/admin/media/fetch/media?page=${page}`, callback, "POST", {
    _token: document.querySelector("meta[name=csrf-token]").content,
    tags,
    type,
  });
};

// eslint-disable-next-line camelcase
const initMediaField = ({ data, last_page }) => {
  customEvent(`loaded_${globalOptions.name}`, {
    medias: data,
  });
  renderMediaList(data);
  initScroll(last_page);
  // initTags();
  initRefresh();
  initUpload();
  // initSelectedMediaEdition();
};

// Render Media List

const renderMediaList = (medias) => {
  toggleLoader(false);
  clearMediaListContainer();
  if (medias.length) renderMediaItems(medias);
  else renderNoMediasFound();
  initSelection(medias);
};

const clearMediaListContainer = () => {
  globalMediaListContainer.innerHTML = "";
};

const renderMediaItems = (medias) => {
  medias.forEach(
    (media) =>
      (globalMediaListContainer.innerHTML += templates.mediaItem(media))
  );
};

const renderNoMediasFound = () => {
  globalMediaListContainer.innerHTML += templates.noMediasFound();
};

// Selection

const initSelection = (medias) => {
  $(".selection-area").selectable();
  $("#media-modal .modal-footer")
    .find(".btn-primary")
    .on("click", () => onMediasSelected(medias));
};

const onMediasSelected = (medias) => {
  const selectedMedias = getSelectedMedias();
  const value = JSON.stringify({
    medias: selectedMedias,
  });
  const totalSelectedMedias = selectedMedias.length;
  const { min, max } = globalOptions;

  if (totalSelectedMedias > max || totalSelectedMedias < min) {
    if (min === max) {
      toast(`Please select exactly ${min} medias`, "error");
    } else {
      toast(`Please select between ${min} and ${max} medias`, "error");
    }
  } else if (selectedMedias.length) {
    $(`.selected-medias-input[name="${globalOptions.name}"]`).val(value);
    customEvent(`change_${globalOptions.name}`, {
      value,
      medias,
      selectedMedias,
    });
  }
};

const getSelectedMedias = () =>
  Object.values(
    globalContainer.querySelectorAll(".selection-area div.ui-selected")
  ).map((selectable) => selectable.dataset.file);

// Init Scroll
let isLoading = false;

const initScroll = (lastPage) => {
  let page = 1;
  $(globalMediaListContainer).on("scroll", () => {
    if (
      globalMediaListContainer.offsetHeight +
        globalMediaListContainer.scrollTop >=
      globalMediaListContainer.scrollHeight - 1
    ) {
      if (!isLoading && page + 1 <= lastPage) {
        page += 1;
        isLoading = true;
        globalMediaListContainer.innerHTML += templates.paginationLoader();

        fetchMedias(
          {
            page,
            tags: getSelectedTags(),
            type: globalOptions.mediaType,
          },
          onPageLoaded
        );
      }
    }
  });
};

const onPageLoaded = ({ data }) => {
  removePaginationLoader();
  // renderMediaisTagsLoadingList(data);
  renderMediaItems(data);
  customEvent(`loaded_new_page_${globalOptions.name}`, {
    medias: data,
  });
  isLoading = false;
};

const removePaginationLoader = () => {
  document.querySelector(".pagination-loader").remove();
};

// Init Tags

const initTags = () => {
  clearTagsListContainer();
  if (globalTags.length) renderTagItems(globalTags);
  else renderNoTagsFound();
  initTagsPagination(globalTagsListContainer.parentElement, globalTagsLastPage);
  initFilterByTag();
  initAsignTag();
  initUnsignTag();
};

const clearTagsListContainer = () => {
  globalTagsListContainer.innerHTML = "";
};

const renderTagItems = (tags) => {
  tags.forEach((tag) => {
    globalTagsListContainer.innerHTML += templates.tagItem(tag);
  });
};

const renderNoTagsFound = () => {
  globalTagsListContainer.innerHTML += templates.noTagsFound();
};

const initFilterByTag = () => {
  document.querySelectorAll(".select-tag").forEach((tagBtn) => {
    tagBtn.addEventListener("click", (event) => {
      toggleTagBtn(event.currentTarget.parentNode);
      toggleLoader(true);
      fetchMedias(
        {
          page: 1,
          tags: getSelectedTags(),
          type: globalOptions.mediaType,
        },
        onListLoaded
      );
    });
  });
};

let isTagsLoading = false;

const initTagsPagination = (container, lastPage) => {
  let page = 1;

  $(container).off("scroll");
  $(container).on("scroll", () => {
    if (
      container.offsetHeight + container.scrollTop >=
      container.scrollHeight - 1
    ) {
      if (!isTagsLoading && page + 1 <= lastPage) {
        page += 1;
        isTagsLoading = true;

        container.innerHTML += templates.tagsLoader();
        getTags(page, ({ data }) => {
          document.querySelector(".tags-loader").remove();
          data.forEach((tag) => {
            container.querySelector("ul").innerHTML += templates.tagItem(tag);
          });
          isTagsLoading = false;
          initFilterByTag();
        });
      }
    }
  });
};

const getTags = (page = 1, callback = false) => {
  request(`/admin/media/fetch/tags?page=${page}`, callback, "POST", {
    _token: document.querySelector("meta[name=csrf-token]").content,
  });
};

const toggleTagBtn = (parent) => {
  const isSelected = Object.values(parent.classList).includes("selected");
  parent.classList.toggle("selected", !isSelected);
};

const getSelectedTags = () => {
  const tagsIds = [];
  document
    .querySelectorAll(".selected .select-tag")
    .forEach((tagBtn) => tagsIds.push(parseInt(tagBtn.dataset.tag, 10)));
  return tagsIds;
};

const onListLoaded = ({ data }) => {
  renderMediaList(data);
};

const initAsignTag = () => {
  $(globalContainer)
    .find("#asign-tag-button")
    .off("click")
    .on("click", onAsignTagClick);
};

const onAsignTagClick = () => {
  const selectedMedias = getSelectedMedias();
  if (selectedMedias.length) {
    customEvent(`asign_tag_${globalOptions.name}`);
    setTimeout(() => {
      const modal = initTagsModal("Asign Tag");
      const saveButton = modal.querySelector("footer .btn-primary");
      saveButton.addEventListener("click", onSaveAsignTag);
    }, 100);
  } else {
    toast("Select some medias first", "error");
  }
};

const initTagsModal = (title) => {
  const modal = document.querySelector("#tag-modal");
  modal.querySelector(".modal-title").textContent = title;
  // modal.querySelector('.modal-body').innerHTML += templates.tagsSelect(globalTags);
  Select2.createAjaxField({
    container: modal.querySelector(".modal-body"),
    id: "tags-modal-select-vue",
    name: "tags",
    label: "tags",
    url: "/admin/media/fetch/tags",
    class: "form-control tags-select",
  });

  Select2.initAjaxField("tags-modal-select-vue");
  return modal;
};

const onSaveAsignTag = () => {
  const tags = [document.querySelector("#tag-modal .tags-select").value];
  const formData = new FormData();
  formData.append("tags", tags);
  formData.append("medias", getSelectedMedias());

  asignTagRequest(formData);
};

const asignTagRequest = (body) => {
  fetch("/api/media/tag", {
    method: "POST",
    body,
  })
    .then((r) => r.json())
    .then((response) => {
      if (response.data) {
        toast("Tags asigned");
      } else toast("There was an error asigning tags", "danger");
    })
    .catch((e) => console.log(e));
};

const initUnsignTag = () => {
  $(globalContainer)
    .find("#unsign-tag-button")
    .off("click")
    .on("click", onUnsignTagClick);
};

const onUnsignTagClick = () => {
  const selectedMedias = getSelectedMedias();
  if (selectedMedias.length) {
    customEvent(`unsign_tag_${globalOptions.name}`);
    setTimeout(() => {
      const modal = initTagsModal("Unsign Tag");
      const saveButton = modal.querySelector("footer .btn-primary");
      saveButton.addEventListener("click", onSaveUnsignTag);
    }, 100);
  } else {
    toast("Select some medias first", "error");
  }
};

const onSaveUnsignTag = () => {
  const tags = [document.querySelector("#tag-modal .tags-select").value];
  const formData = new FormData();
  formData.append("tags", tags);
  formData.append("medias", getSelectedMedias());

  unsignTagRequest(formData);
};

const unsignTagRequest = (body) => {
  fetch("/api/media/tag/unsign", {
    method: "POST",
    body,
  })
    .then((r) => r.json())
    .then((response) => {
      if (response.data) {
        toast("Tags unsigned");
      } else toast("There was an error unsigning tags", "danger");
    })
    .catch((e) => console.log(e));
};

// Refresh

const initRefresh = () => {
  globalContainer
    .querySelector("#refreshBtn")
    .addEventListener("click", onRefreshClick);
};

const onRefreshClick = () => {
  toggleLoader(true);
  fetchMedias(
    {
      page: 1,
      type: globalOptions.mediaType,
    },
    onRefresh
  );
};

const onRefresh = ({ data }) => {
  customEvent(`on_refresh_${globalOptions.name}`, data);
  renderMediaList(data);
};

// Upload

const initUpload = () => {
  const uploadButton = globalContainer.querySelector("#upload-button");
  const hiddenInput = globalContainer.querySelector("#upload-field");

  hiddenInput.addEventListener("change", onHiddenInputChange);
  uploadButton.addEventListener("click", onUploadClick);
};

const onUploadClick = () => {
  const hiddenInput = globalContainer.querySelector("#upload-field");
  hiddenInput.value = "";
  hiddenInput.click();
};

const onHiddenInputChange = (e) => {
  globalUploadList = [];
  e.currentTarget.files.forEach((media) => {
    globalUploadList.push({
      media,
      cropped: null,
    });
  });
  customEvent(`upload_modal_open_${globalOptions.name}`);
  setTimeout(initUploadModal, 100);
};

const initUploadModal = (files = globalUploadList) => {
  let extensions = null;
  const i = globalMediaTypes.findIndex((e) => e.id === mediaType);
  if (i >= 0) extensions = globalMediaTypes[i].extensions;
  if (extensions) {
    files = files.filter((file) => {
      const [, extension] = file.media.name.split(".");
      if (!extensions.includes(extension)) {
        toast("Some of the medias do not have the correct extension", "error");
        return false;
      }
      return true;
    });
  }

  globalUploadContainer = document.querySelector("#upload-modal-vue");
  const uploadModal = document.querySelector("#upload-modal-vue");
  uploadModal.querySelector(".modal-title").innerHTML =
    templates.uploadModalTitle(files.length);

  renderUploadsPreview(files);
  uploadModal
    .querySelector("footer .btn-primary")
    .addEventListener("click", (e) => {
      onUploadSave(e, files);
    });

  window.addEventListener(
    `upload_modal_close_${globalOptions.name}`,
    onRefreshClick
  );

  initCrop();
};

const renderUploadsPreview = (files) => {
  const listContainer = document.querySelector(
    "#upload-modal-vue .medias-list"
  );
  listContainer.innerHTML = "";
  let i = 0;
  listContainer.innerHTML += templates.visitdataForm(i);
  if (globalParents.show) {
    initParentSelect2(i, globalParents.label);
  }
  files.forEach((file) => {
    listContainer.innerHTML += templates.uploadPreview(
      file,
      i,
      globalMediaTypes,
      mediaType,
      extraFields
    );
    initVideoPreview(file.media, i);
    initAudioPreview(file.media, i);
    i += 1;
  });

  initRemoveButtons(files);
  if (globalParents.show) {
    Select2.initGroupedFields(globalUploadContainer);
  } else if (globalParents.id) {
    listContainer.innerHTML += `
      <input type="text" value="${globalParents.id}" name="parentId" class="hidden-id" hidden>
      <input type="text" value="${globalParents.model}"  class="hidden-model" name="parentModel" hidden>
    `;
  }
};

const initRemoveButtons = (files) => {
  const removeMediaBtns = document.querySelectorAll(".remove-media-btn");
  removeMediaBtns.forEach((removeBtn) => {
    removeBtn.addEventListener("click", (e) => {
      const mediaName = e.target.dataset.name;
      files = files.filter((file) => file.media.name !== mediaName);
      initUploadModal(files);
    });
  });
};

const initVideoPreview = (media, i) => {
  const video = document.querySelector(`#video-preview-video-${i}`);
  if (video) {
    const reader = new FileReader();
    reader.onloadend = () => {
      video.src = reader.result;
    };
    reader.readAsDataURL(media);
  }
};

const initAudioPreview = (media, i) => {
  const audio = document.querySelector(`#audio-preview-source-${i}`);
  if (audio) {
    audio.src = URL.createObjectURL(media);
    document.querySelector(`#audio-preview-audio-${i}`).load();
  }
};

const initParentSelect2 = (i, label) => {
  Select2.createGroupedField({
    label,
    name: "parentId",
    container: globalUploadContainer.querySelector(`#select2-container-${i}`),
    url: "/admin/media/fetch/parents",
    class: "form-control",
  });
};

const onUploadSave = (e, files) => {
  removeValidationErrors();
  e.currentTarget.classList.add("d-none");
  appendLoadersToUploads(files);
  resolveUploadPromises(generateUploadPromises(files));
};

const appendLoadersToUploads = () => {
  const fileNames = document.querySelectorAll("span.loader-container");
  fileNames.forEach((fileName) => {
    fileName.innerHTML += '<span class="ml-2 la la-spinner la-spin"></span>';
  });
};

const generateUploadPromises = (files) => {
  let i = 0;
  const promises = [];
  files.forEach((file) => {
    const metadata = generateFileMetadata(file, i);
    promises.push(makeUploadPromise(metadata));
    i += 1;
  });
  return promises;
};

const generateFileMetadata = (file, i) => {
  const metadata = {};
  const metadataFields = document.querySelectorAll(
    `#metadata-form-${i} .form-control`
  );
  metadataFields.forEach((field) => (metadata[field.name] = field.value));

  metadata.media = file.media;
  metadata.cropped = file.cropped ? file.cropped : null;
  metadata.name = file.media.name;

  const parentSelect = document.querySelector('select[name="parentId"]');
  if (parentSelect !== null) {
    const dataAttrs = $(parentSelect).find(":selected").data();
    if (dataAttrs !== undefined) {
      metadata.parent_model = dataAttrs.namespace;
      metadata.parent_id = parentSelect.value;
    }
  }

  const parentIdHidden = document.querySelector(".hidden-id");
  const parentNamespaceHidden = document.querySelector(".hidden-model");

  if (parentIdHidden !== null && parentNamespaceHidden !== null) {
    metadata.parent_id = parentIdHidden.value;
    metadata.parent_model = parentNamespaceHidden.value;
  }

  return metadata;
};

const makeUploadPromise = (metadata) =>
  fetch("/api/media/upload", {
    method: "POST",
    body: setExtraFields(metadata),
  });

const resolveUploadPromises = (promises) => {
  const promiseResponses = [];
  Promise.all(promises)
    .then(
      (responsesAll) => {
        responsesAll.forEach((responseAll) => {
          if (responseAll.ok) {
            promiseResponses.push(responseAll.json());
          }
        });
      },
      (e1) => console.log(e1)
    )
    .then(() => {
      Promise.all(promiseResponses).then((responses) => {
        responses.forEach((response) => handleUploadResponse(response));
      });
    });
};

const handleUploadResponse = ({ data, errors }) => {
  const fileRow = document.querySelector(
    `.file-row[data-name="${data.filename}"]`
  );

  if (!errors) {
    handleSuccessResponse(fileRow, data);
  } else if (fileRow) {
    handleErrorResponse(fileRow, errors);
  }
};

const removeValidationErrors = () => {
  document
    .querySelectorAll("span.text-danger, p.text-danger")
    .forEach((err) => err.remove());
};

const handleSuccessResponse = (row, { msg, success }) => {
  const fileLoader = row.querySelector("span.loader-container");

  fileLoader.classList.value = "ml-2";
  fileLoader.innerHTML = success ? "✅" : "❌";

  const textClass = success ? "success" : "danger";
  const feedback = row.querySelector(".card-header p");
  if (feedback) {
    feedback.innerHTML = msg;
    feedback.classList.remove("text-danger");
    feedback.classList.remove("text-success");
    feedback.classList.add(`text-${textClass}`);
  }
};

const handleErrorResponse = (row, errors) => {
  Object.entries(errors).forEach(([name, errs]) => {
    const field = row.querySelector(
      `input[name="${name}"], select[name="${name}"]`
    );
    errs.forEach((error) => {
      $(field.parentElement).append(`<span class="text-danger">${error}</div>`);
    });
  });

  const fileLoader = row.querySelector("span.loader-container");

  fileLoader.innerHTML = "❌";
  const feedback = row.querySelector(".card-header p");
  feedback.innerHTML = "The provided metadata is invalid";
  feedback.classList.add("text-danger");
  feedback.classList.remove("text-success");

  document
    .querySelector("#upload-modal-vue footer .btn-primary")
    .classList.remove("d-none");
  // $(row).find('.collapse').collapse('show');
};

const initCrop = () => {
  $(".crop-btn")
    .unbind()
    .click((e1) => {
      const i1 = e1.target.dataset.id;
      const imageCropper = document.querySelector(`#imageCropper_${i1}`);
      initCropper(i1);
      if (Object.values(imageCropper.classList).includes("d-none")) {
        imageCropper.classList.remove("d-none");
      } else {
        imageCropper.classList.add("d-none");
      }
    });
};

const initCropper = (i) => {
  const imgTobeCrop = document.querySelector(`.to_be_crop_${i}`);
  const ImgCrop = new Cropper(imgTobeCrop, {
    aspectRatio: "1/1",
  });

  const buttonConfirm = document.querySelector(`#crop_btn_${i}`);

  buttonConfirm.addEventListener("click", () => {
    const canvas = ImgCrop.getCroppedCanvas();
    if (canvas !== null) {
      canvas.toBlob((blob) => {
        blob.lastModifiedDate = new Date();
        blob.lastModified = new Date();

        const croppedImage = new File([blob], globalUploadList[i].media.name, {
          type: blob.type,
        });

        globalUploadList[i].media = croppedImage;
        document.querySelector(`#image-preview-${i}`).src =
          URL.createObjectURL(croppedImage);
        $(`#crop-btn-${i}`).click();
        toast("Image cropped with success");
      });
    }
  });
};

// Selected media edition

const initSelectedMediaEdition = () => {
  window.addEventListener(
    `edit_media_${globalOptions.name}`,
    onEditSelectedMedia
  );
};

const onEditSelectedMedia = ({ detail }) => {
  const { mediaId, medias } = detail;
  const [media] = medias.filter((m) => String(m.id) === String(mediaId));
  const modal = document.querySelector("#edit-media-modal");

  initEditMediaModal(media.id, modal, media);
  setEditableValues(media, modal);
  modal.querySelector("footer .btn-primary").addEventListener("click", () => {
    onEditionSave(modal, media);
  });
};

const initEditMediaModal = (id, modal, media) => {
  const obj = {
    media,
  };
  modal.querySelector(".modal-body").innerHTML = templates.metadataForm(
    id,
    globalMediaTypes,
    obj,
    mediaType,
    extraFields
  );
  modal.querySelector("footer .btn-primary").innerHTML = "Save";
  modal.querySelector("header .modal-title").textContent = "Edit Media";
};

const setEditableValues = (media, modal) => {
  const parentField = modal.querySelector('select[name="parentId"]');
  if (parentField) {
    parentField.value = media ? media.parent_id : "";
  }

  const titleField = modal.querySelector('input[name="title"]');
  if (media) titleField.value = media.title;

  const descriptionField = modal.querySelector('textarea[name="description"]');
  if (descriptionField) {
    descriptionField.value = media ? media.description : "";
  }

  // const extraFields = modal.querySelector('input[name="title"]')
  const metadataFields = document.querySelectorAll(
    `#metadata-form-${media.id} .form-control`
  );
  metadataFields.forEach((field) => {
    const fieldName = field.name.split(" ");
    let mediaExtraFields;
    if (media.extra_fields) {
      mediaExtraFields = media.extra_fields;
    } else if (media.media_content && media.media_content.extra_fields) {
      mediaExtraFields = media.media_content.extra_fields;
    }
    if (
      fieldName.includes("extra-field") &&
      mediaExtraFields &&
      mediaExtraFields[fieldName[0]]
    ) {
      if (field.type === "checkbox") {
        field.checked = true;
      } else {
        field.value = mediaExtraFields[fieldName[0]];
      }
    }
  });
};

const onEditionSave = (modal, media) => {
  const metaData = {};
  const metadataFields = document.querySelectorAll(
    `#metadata-form-${media.id} .form-control`
  );
  metadataFields.forEach((field) => {
    if (field.type === "checkbox") {
      metaData[field.name] = field.checked;
    } else {
      metaData[field.name] = field.value;
    }
  });
  //   const description = modal.querySelector('textarea[name="description"]') ? modal.querySelector('textarea[name="description"]').value : 'Empty';
  //   const mediaData = {
  //     title: modal.querySelector('input[name="title"]').value,
  //     description,
  //     type: media.type_id,
  //   };

  const parentField = modal.querySelector('select[name="parentId"]');
  if (parentField !== null) {
    metaData.parent = modal.querySelector('select[name="parentId"]').value;
  }

  const formData = new FormData();
  //   Object.entries(mediaData).forEach(([key, value]) => {
  //     formData.append(key, value);
  //   });

  const obj = {};

  fetch(`/api/media/${media.id}/edit`, {
    method: "POST",
    body: setExtraFields(metaData),
  })
    .then((r) => r.json())
    .then(onEditionResponse);
};

const onEditionResponse = ({ data, errors }) => {
  document
    .querySelectorAll("#edit-media-modal small.text-danger")
    .forEach((err) => err.remove());

  if (!errors && data.updated) {
    customEvent(`updated_media_${globalOptions.name}`, {
      media: data,
    });
  } else {
    const modal = document.querySelector("#edit-media-modal");
    if (errors) {
      Object.entries(errors).forEach(([name, errs]) => {
        const field = modal.querySelector(
          `input[name="${name}"], select[name="${name}"]`
        );
        errs.forEach((error) => {
          $(field.parentElement).append(
            `<span class="text-danger">${error}</div>`
          );
        });
      });
    }
  }
};

function setExtraFields(metadata) {
  const formData = new FormData();
  const obj = {};
  Object.entries(metadata).forEach(([key, value]) => {
    const customFields = key.split(" ");
    if (customFields.includes("extra-field")) {
      obj[customFields[0]] = value;
    } else {
      formData.append(key, value);
    }
  });
  formData.append("extra_fields", JSON.stringify(obj));
  formData.append("description", "Empty");
  return formData;
}

export default {
  init,
};
