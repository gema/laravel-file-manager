import '../sass/style.scss';

const {init} = require('./file-manager');

$( document ).ready(function() {
    console.log('initing filemanager')
    init();
});