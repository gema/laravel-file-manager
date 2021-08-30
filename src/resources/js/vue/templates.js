const { truncate } = require('../utils');

const mediaItem = media => `
<div
  title="${media.media_content.title}" 
  class="selectable col-md-2 col-sm-3 m-1" data-file="${media.id}"
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

const noTagsFound = () => '<li  class="list-group-item">No Tags</li>'

module.exports = {
  templates: {
    mediaItem,
    paginationLoader,
    noMediasFound,
    tagItem,
    noTagsFound,
  },
}