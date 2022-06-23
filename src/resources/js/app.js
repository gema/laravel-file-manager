import '../sass/style.scss';
import 'cropperjs/dist/cropper.css';

window.$ = window.jQuery = require('jquery');
import 'bootstrap';
import 'jquery-ui/ui/widgets/selectable';
import Cropper from 'cropperjs';

require('select2');

window.Cropper = Cropper;

const { init } = require('./file-manager');
const { templates } = require('./templates');

window.onload = init;

// File Manager JS API
window.FileManagerAPI = {
  renderSelectedMedias: (fieldName, selectedMedias) => {
    const baseField = document.querySelector(`.filemanager-field[name="${fieldName}"]`);
    const container = baseField.querySelector('.selected-medias-list');
        
    const totalMediasSelectedField = baseField.querySelector('.selected-medias-number');
    totalMediasSelectedField.textContent = selectedMedias.length;

    container.innerHTML = '';
    selectedMedias.forEach(media => {
      container.innerHTML += templates.selectedMedia(media);
    });

    const input = baseField.querySelector('.selected-medias-input');
    input.value = JSON.stringify({ medias: selectedMedias.map(m => m.id) });
  },
};
