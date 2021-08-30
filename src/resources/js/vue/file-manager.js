const { request } = require('../utils');
const { templates } = require('./templates');

let globalTags;
let globalMediaTypes;
let globalOptions;

let globalMediaListContainer;
let globalTagsListContainer;

const init = options => {
  $.getScript()
  globalOptions = options;
  loadGlobals(onGlobalsLoaded);
}

const loadGlobals = (callback = false) => {
  toggleLoader(true);
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

const initSelection = ({data}) => {
  // Use jQueryUI
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
  isLoading = false;
  // initSelection()?
}

const removePaginationLoader = () => {
  document.querySelector('.pagination-loader').remove();
}


// Init Tags

const initTags = () => {
  clearTagsListContainer();
  globalTags.length ? renderTagItems(globalTags) : renderNoTagsFound();
  initFilterByTag();
//   initAsignTag();
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

module.exports = { init };