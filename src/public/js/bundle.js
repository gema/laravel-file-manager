(()=>{var a={479:(e,t,a)=>{const g=a(693),{request:r,truncate:f,toast:d,arrayUniqueByKey:l}=a(287),y=a(838)['templates'];let s=[],o=null,n=1,m=[],i=!1,c=[];const u=(e,t=!0)=>{const a=document.querySelector(e+'.selection-area');if(a){a.innerHTML='';const o=document.querySelector(e+'.media-loader');o.classList.toggle('d-none',!t)}},p=e=>{const t=[];return document.querySelectorAll(e+' .selected .select-tag').forEach(e=>t.push(parseInt(e.dataset.tag,10))),t},v=e=>(selectedMedias=[],document.querySelectorAll(e+'.selectable.ui-selected').forEach(e=>{selectedMedias.push(e.dataset.file)}),selectedMedias),b=(e=1,t=null,a=!1,o=!1)=>{r('/admin/media/fetch/media?page='+e,o,'POST',{_token:document.querySelector('meta[name=csrf-token]').content,tags:t,type:a})},h=e=>`
  <div
    title="${e.media_content.title}" 
    class="selectable col-md-2 col-sm-3 m-1" data-file="${e.id}">
    <img src="${e.media_content.preview}">
  </div>
`,S=(e,t)=>{return`
  <form id="metadata-form-${t}">
    ${`
    <div id="select2-container-${t}" class="form-group">
      
    </div>
  `}
    <div class="form-group">
      <label>${__('title')}</label>
      <input name="title" type="text" class="form-control">
    </div>
    <div class="form-group">
      <label>${__('description')}</label>
      <textarea name="description" class="form-control"></textarea>
    </div>
    ${(e=>{let t='';return e.forEach(e=>{t+=`<option value="${e.id}">${e.name}</option>`}),`
  <div class="form-group">
    <label>${__('mediaType')}</label>
    <select name="type" class="form-control">
      ${t}
    </select>
  </div>`})(e)}
  </form>`},_=(e,u)=>{console.log({medias:e,types:u});const p=document.querySelector('#upload-modal .medias-list');p.innerHTML='';let v=0;e.forEach(({media:e,is3d:t})=>{let a='',o=!1,r=!1;['video/avi'].includes(e.type)?a=`<small>${__('noPreview',[e.type])}</small>`:/^image/.test(e.type)?a='image/gif'!==e.type?(c=`
          <button id="crop-btn-${v}" class="form-control btn btn-default btn-sm crop-btn" data-id="${v}">
            ${__('crop')}
          </button>`,`
          <img
            id="image-preview-${v}" 
            class="w-100 my-3"
            src="${URL.createObjectURL(e)}">
          ${c}
          <div class="mt-1" id="crop_image_${v}">
            ${((e,t)=>{const a=document.createElement('img'),o=(a.classList.add('to_be_crop_'+t),a.style.maxWidth='100%',a.src=URL.createObjectURL(e),document.createElement('button'));return o.textContent='Confirm',o.classList='confirm-crop btn btn-default btn-sm',o.id='crop_btn_'+t,`
  <div class="d-none" id="imageCropper_${o.dataset.id=t}">
    ${o.outerHTML}
    ${a.outerHTML}
  </div>`})(e,v)}
          </div>
        `):`
          <img
            id="image-preview-${v}" 
            class="w-100 my-3"
            src="${URL.createObjectURL(e)}">
        `:/^video/.test(e.type)?(o=!0,a=`
        <video controls id="video-preview-video-${v}" class="w-100 my-3">
          <source id="video-preview-source-${v}" src="">
          Your browser does not support the video tag.
        </video>`):/^audio/.test(e.type)&&(r=!0,a=`
      <audio class="w-100 my-3" id="audio-preview-audio-${v}" controls>
        <source src="" id="audio-preview-source-${v}" />
      </audio>`);let n=e.size,l='',s=0;for(var i=['KB','MB','GB'];1024<n&&s<i.length;)n=Math.round(n/1024),l=i[s],s+=1;var c=y.metadataForm(v,u,{media:e,is3d:t});if(p.innerHTML+=`
      <div class="card file-row" data-name="${e.name}">
        <div class="card-header" id="heading_${v}">
          <h5 class="mb-0" style="text-align:center">
            <button
              class="btn btn-link"
              data-toggle="collapse"
              data-target="#collapse_${v}"
              aria-expanded="true"
              aria-controls="collapse_${v}"
              title="${e.name}"
            >
            <b>${f(e.name,25)}</b> ${n} ${l}
            <span class="loader-container"></span>
            <p class="mt-2 mb-0 text-center"></p>
            </button>
            <a href="#" style="float:right" class="text-danger">
              <i
                style="vertical-align:middle"
                data-name="${e.name}"
                class="remove-media-btn las la-trash-alt">
              </i>
            </a>
          </h5>
        </div>
        <div
          id="collapse_${v}" 
          class="collapse ${0===v?'show':''}"
          aria-labelledby="heading_${v}"
          data-parent="#accordion">   
          <div class="card-body">
            ${a}
            ${c}
          </div>
        </div>
      </div>`,o){const d=new FileReader,m=v;d.onloadend=()=>{const e=document.querySelector('#video-preview-video-'+m);e.src=d.result},d.readAsDataURL(e)}r&&(document.querySelector('#audio-preview-source-'+v).src=URL.createObjectURL(e),document.querySelector('#audio-preview-audio-'+v).load()),g.createGroupedField({container:document.querySelector('#select2-container-'+v),name:'parentId',label:'Parent',url:'/admin/media/fetch/parents',class:'form-control'}),v+=1}),g.initGroupedFields()},w=(s,i,c)=>{document.querySelectorAll(s+'.selected-media').forEach(e=>{e.addEventListener('click',e=>{const t=e.currentTarget.dataset.media,[o]=i.filter(e=>String(e.id)===t),r=document.querySelector('#edit-media-modal'),n=(r.querySelector('.modal-body').innerHTML=S(m,o.id),r.querySelector('.modal-save').innerHTML='Save',r.querySelector('select[name="parentId"]')),a=(null!==n&&(n.value=o?o.parent_id:''),r.querySelector('input[name="title"]')),l=(a.value=o.media_content?o.media_content.title:'',r.querySelector('textarea[name="description"]'));l.value=o.media_content?o.media_content.description:'',r.querySelector('.modal-save').addEventListener('click',()=>{const e={title:r.querySelector('input[name="title"]').value,description:r.querySelector('textarea[name="description"]').value},a=(null!==n&&(e.parent=r.querySelector('select[name="parentId"]').value),new FormData);Object.entries(e).forEach(([e,t])=>{a.append(e,t)}),fetch(`/api/media/${o.media_content.id}/edit`,{method:'POST',body:a}).then(e=>e.json()).then(e=>{r.querySelectorAll('small.text-danger').forEach(e=>e.remove()),!e.errors&&e.data.updated?(document.querySelector(`${s}.selected-media[data-media="${o.id}"]`).outerHTML=y.selectedMedia(e.data.media),r.querySelector('.modal-save').innerHTML='<span class="modal-loader la la-spinner la-spin"></span>',u(s,!0),b(1,'',c,e=>{w(s,e.data,c),x(e,s,c),$(r).modal('hide'),d(__('mediaUpdated'))})):Object.entries(e.errors).forEach(([e,t])=>{const a=r.querySelector(`input[name="${e}"], textarea[name="${e}"], select[name="${e}"]`);t.forEach(e=>{a.parentElement.innerHTML+=`<small class="text-danger">${e}</small>`})})})}),$(r).modal('show')})})},L=(o,r,n)=>{$('.selection-area').selectable(),''!==r&&document.querySelector(r+'#selectFilesBtn').addEventListener('click',()=>{const t=v(r);let e;e=t.length?JSON.stringify({medias:t}):null,document.querySelector(r+' .selected-medias-input').value=e;const a=document.querySelector(r+'.selected-medias-list');a.innerHTML='',document.querySelector(r+'.selected-medias-number').innerHTML=''+t.length,0<t.length?(o.forEach(e=>{t.includes(String(e.id))&&(a.innerHTML+=y.selectedMedia(e))}),w(r,o,n)):a.innerHTML=`
            <li class="list-group-item">
              <small>${__('noMediasSelected')}</small>
            </li>
          `})},q=(a,e,o='',r)=>{let t=1,n=!1;$(a).off('scroll'),$(a).on('scroll',()=>{a.offsetHeight+a.scrollTop>=a.scrollHeight-1&&!n&&t+1<=e&&(t+=1,n=!0,a.innerHTML+=`
        <div class="pagination-loader col-sm-12 d-flex justify-content-center m-0">
          <h4><span class="la la-spinner la-spin mt-3"></span></h4>
        </div>`,b(t,p(o),r,e=>{a.querySelector('.pagination-loader').remove();const t=e.data;t.forEach(e=>{a.innerHTML+=h(e)}),s=l(s.concat(t),'id'),n=!1,''!==o&&L(s,o,r)}))})},x=(t,a,o=!1)=>{s=l(s.concat(t.data),'id'),u(a,!1);const r=document.querySelector(a+' .custom-file-manager .list');r.innerHTML='',t.data.length?t.data.forEach(e=>{r.innerHTML+=h(e),q(r,t.last_page,a,o),L(s,a,o)}):r.innerHTML=`
    <tr>
      <td class="empty" colspan="6">${__('noMediasFound')}</td>
    </tr>`},T=(t='',a=!1)=>{document.querySelector(t+'#refreshBtn').addEventListener('click',()=>{u(t,!0),b(1,'',a,e=>{x(e,t,a)})})};const M=(a,o)=>{const e=document.querySelector('#upload-modal .modal-title span'),t=document.querySelector('#upload-modal .modal-save'),r=t.querySelector('span');var n=a.length;_(a,o),t.classList.remove('d-none'),e.innerHTML=n,r.innerHTML=n;const l=document.querySelectorAll('.remove-media-btn');l.forEach(e=>{e.addEventListener('click',e=>{const t=e.target.dataset.name;a=a.filter(e=>e.media.name!==t),M(a,o)})}),$('#upload-modal .modal-save').off('click').on('click',s=>{s.currentTarget.classList.add('d-none');const n=[],t=[];let l=0;const e=document.querySelectorAll('span.loader-container');e.forEach(e=>{e.innerHTML+='<span class="ml-2 la la-spinner la-spin"></span>'}),a.forEach(e=>{const t=document.querySelectorAll(`#metadata-form-${l} .form-control`),a={};t.forEach(e=>a[e.name]=e.value);var o,r=document.querySelector(`#metadata-form-${l} select[name="parentId"]`);null!==r&&void 0!==(o=$(r).find(':selected').data())&&(a.parent_model=o.namespace,a.parent_id=r.value),n.push(((e,t)=>{const a=new FormData;return a.append('media',e.media),a.append('cropped',e.cropped||null),a.append('name',e.media.name),Object.entries(t).forEach(([e,t])=>{a.append(e,t)}),fetch('/api/media/upload',{method:'POST',body:a})})(e,a)),l+=1}),Promise.all(n).then(e=>{e.forEach(e=>{e.ok&&t.push(e.json())})},e=>console.log(e)).then(()=>{Promise.all(t).then(e=>{e.forEach(e=>{const o=document.querySelector(`.file-row[data-name="${e.data.filename}"]`);if(document.querySelectorAll('small.text-danger').forEach(e=>e.remove()),e.errors){if(o){Object.entries(e.errors).forEach(([e,t])=>{const a=o.querySelector(`input[name="${e}"], select[name="${e}"]`);t.forEach(e=>{a.parentElement.innerHTML+=`<small class="text-danger">${e}</small>`})});const a=o.querySelector('span.loader-container'),r=(a.innerHTML='❌',o.querySelector('.card-header p'));r.innerHTML=__('invalidMetadata'),r.classList.add('text-danger'),r.classList.remove('text-success'),$(o).find('.collapse').collapse('show'),s.currentTarget.classList.remove('d-none')}}else{var{msg:e,success:t}=e.data;const n=o.querySelector('span.loader-container');n.classList.value='ml-2',n.innerHTML=t?'✅':'❌';t=t?'success':'danger';const l=o.querySelector('.card-header p');l.textContent=e,l.classList.remove('text-danger'),l.classList.remove('text-success'),l.classList.add('text-'+t)}})})})}),$('.crop-btn').off('click').on('click',e=>{e=e.target.dataset.id;const t=document.querySelector('#imageCropper_'+e);{var a=e;e=document.querySelector('.to_be_crop_'+a);const o=new Cropper(e,{aspectRatio:'1/1'}),r=document.querySelector('#crop_btn_'+a);r.addEventListener('click',()=>{const e=o.getCroppedCanvas();null!==e&&e.toBlob(e=>{e.lastModifiedDate=new Date,e.lastModified=new Date;e=new File([e],c[a].media.name,{type:e.type});c[a].media=e,document.querySelector('#image-preview-'+a).src=URL.createObjectURL(e),$('#crop-btn-'+a).click(),d(__('imageCropped'))})})}Object.values(t.classList).includes('d-none')?t.classList.remove('d-none'):t.classList.add('d-none')})},E=(t='',a=!1)=>{const e=$('#upload-modal');e.on('shown.bs.modal',()=>{M(c,m)}),e.on('hidden.bs.modal',()=>{i=!1,u(t,!0),b(1,'',a,e=>{x(e,t,a)})})},j=e=>{const t=document.querySelector(e+' #upload-field');e=document.querySelector(e+' #upload-button');const a=$('#upload-modal');$(e).off('click'),$(e).on('click',()=>{t.value='',t.click()}),t.addEventListener('change',()=>{c=[],t.files.forEach(e=>{var t=e.name.split('.').pop();c.push({media:e,cropped:null,is3d:['dae','abc','usd','usdc','usda','ply','stl','fbx','glb','gltf','obj','x3d'].includes(t)})}),i||(a.modal('show'),i=!0)})},O=(e,t,a)=>{x(e,t,a),w(t,e.data,a);e=new Event('medias-loaded');document.querySelector(t+' #filemanager-container').dispatchEvent(e),T(t,a),j(t),E(t,a);{e=t;const o=document.querySelector(e+'.browse-media-btn-container'),r=o.querySelector('.filemanager-toggle'),n=o.querySelector('.la-spinner');return r.disabled=!1,void n.remove()}},H=e=>{x(e,''),T(),j(''),E()},k=({data:e})=>{var{tags:e,types:t}=e;o=e.data,n=e.last_page,m=t.data},F=e=>{k(e);const t=document.querySelector('template.upload-modal');e=t.content.cloneNode(!0);document.body.appendChild(e);const a=document.querySelectorAll('.filemanager-field.modal-dialog');a.length?a.forEach(e=>{var t=null!==e&&e.getAttribute('name');const a=t?`.filemanager-field[name="${t}"] `:'',o=e.dataset['type'];b(1,'',o,e=>{O(e,a,o)})}):b(1,'',!1,e=>{H(e)})};e.exports={init:()=>{var e;e=F,u('',!0),r('/admin/media/fetch/global-data',e,'POST')}}},693:(e,t,a)=>{const n=a(287)['getPossibleTranslation'];const o=(e,t)=>{return`
    <label>${e.label}</label>
    <select
      ${void 0!==e.id?`id="${e.id}"`:''}
      name="${e.name}"
      style="${e.style||'width:100%'}"
      class="${e.class||'form-control'} ${t}"
      data-url="${e.url}"
    >
    </select>`};e.exports={createGroupedField:e=>{var t=o(e,'select2-grouped');e.container.innerHTML+=t},initGroupedFields:(e=document)=>{e.querySelectorAll('.select2-grouped').forEach(e=>{var t=e.dataset['url'];const r=[];console.log(t),$(e).select2({theme:'bootstrap',multiple:!1,ajax:{url:t,type:'POST',dataType:'json',data:e=>{return{search:e.term,page:e.page||1}},processResults({data:e}){var t=Object.keys(e).length;const a=[];let o;return 1<t?(Object.entries(e).forEach(([t,e])=>{e.current_page===e.last_page&&r.push(t),e.data.length&&a.push({text:t.split('\\').pop(),children:Object.values(e.data).map(e=>({id:e.id,text:n(JSON.stringify(e.name)),namespace:t}))})}),o=r.length<t):Object.entries(e).forEach(([t,e])=>{Object.values(e.data).forEach(e=>{a.push({id:e.id,text:n(JSON.stringify(e.name)),namespace:t})}),o=e.current_page<e.last_page}),console.log({results:a}),{results:a,pagination:{more:o}}}}}).on('select2:select',e=>{var t=e.params['data'];$(e.currentTarget).children()[0].dataset.namespace=t.namespace})})},createAjaxField:e=>{var t=o(e,'select2-ajax');e.container.innerHTML=t},initAjaxField:e=>{var e=document.querySelector('#'+e),t=e.dataset['url'];$(e).select2({theme:'bootstrap',multiple:!1,ajax:{url:t,type:'POST',dataType:'json',data:e=>{return{search:e.term,page:e.page||1}},processResults({data:e,current_page:t,last_page:a}){const o=[];return Object.values(e).forEach(e=>{o.push({id:e.id,text:n(JSON.stringify(e.name))})}),more=t<a,console.log({results:o,pagination:{more:more}}),{results:o,pagination:{more:more}}}}})}}},838:(e,t,a)=>{const c=a(287)['truncate'];const o=e=>e.map(e=>`
  <option value="${e.id}">
    ${e.name}
  </option>
`);const d=(e,t,{media:a,is3d:o})=>{let{name:r,type:n}=a;o&&(n='model');a=l(t,n);return`
    <form id="metadata-form-${e}">
      ${`
    <div id="select2-container-${e}" class="form-group">
      
    </div>
  `}
      <div class="form-group">
        <label>Title</label>
        <input name="title" type="text" class="form-control" value="${r.split('.').shift()}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description" class="form-control"></textarea>
      </div>
      ${a}
    </form>`},l=(e,t)=>{let a='',o;return/^image/.test(t)?[o]=e.filter(e=>'image'===e.key):/^video/.test(t)?[o]=e.filter(e=>'video'===e.key):/^audio/.test(t)?[o]=e.filter(e=>'audio'===e.key):/^model/.test(t)&&([o]=e.filter(e=>'3d_model'===e.key)),e.forEach(e=>{a+=`<option ${o.id===e.id?'selected':''} value="${e.id}">${e.name}</option>`}),`
  <div class="form-group">
    <label>Media Type</label>
    <select name="type" class="form-control">
      ${a}
    </select>
  </div>`},m=(e,t,a)=>{var o=e['type'];let r='';return a?r='3D Model Preview':['video/avi'].includes(o)?r=n(o):/^image/.test(o)?r=s(e,t):/^video/.test(o)?r=i(t):/^audio/.test(o)&&(r=u(t)),r},n=e=>`
  <small>No preview available for type ${e}</small>
`,s=(e,t)=>{let a='';return['image/gif'].includes(e.type)||(a=`
    <button id="crop-btn-${t}" class="form-control btn btn-default btn-sm crop-btn" data-id="${t}">
      Crop
    </button>
    <div class="mt-1" id="crop_image_${t}">
      ${r(e,t)}
    </div>
    `),`
    <img
      id="image-preview-${t}" 
      class="w-100 my-3"
      src="${URL.createObjectURL(e)}"
    >
    ${a}
  `},r=(e,t)=>{const a=document.createElement('img'),o=(a.classList.add('to_be_crop_'+t),a.style.maxWidth='100%',a.src=URL.createObjectURL(e),document.createElement('button'));return o.textContent='Confirm',o.classList='confirm-crop btn btn-default btn-sm',o.id='crop_btn_'+t,`
  <div class="d-none" id="imageCropper_${o.dataset.id=t}">
    ${o.outerHTML}
    ${a.outerHTML}
  </div>`},i=e=>`
<video controls id="video-preview-video-${e}" class="w-100 my-3">
  <source id="video-preview-source-${e}" src="">
  Your browser does not support the video tag.
</video>`,u=e=>`
<audio class="w-100 my-3" id="audio-preview-audio-${e}" controls>
  <source src="" id="audio-preview-source-${e}" />
</audio>`;e.exports={templates:{mediaItem:e=>`
<div
  title="${e.media_content.title}" 
  class="ui-widget-content selectable col-md-2 col-sm-3 m-1" data-file="${e.id}"
>
  <img src="${e.media_content.preview}">
</div>
`,paginationLoader:()=>`
<div class="pagination-loader col-sm-12 d-flex justify-content-center m-0">
  <h4><span class="la la-spinner la-spin mt-3"></span></h4>
</div>`,noMediasFound:()=>'<p>No Medias Found<p>',tagItem:e=>`
<li class="list-group-item">
  <a href="#" title="${e.name}" class="select-tag" data-tag="${e.id}">
    ${c(e.name,10)}
  </a>
</li>
`,noTagsFound:()=>'<li  class="list-group-item">No Tags</li>',tagsSelectOptions:o,tagsSelect:e=>{return`
  <select name="tags" class="tags-select form-control">
  ${o(e)}
  </select>`},tagsLoader:()=>'<span class="w-100 text-center tags-loader la la-spinner la-spin mt-3"></span>',uploadModalTitle:e=>`
  Uploading <span class="medias-count">${e}</span> medias
`,mediaPreview:m,noPreview:n,imagePreview:s,videoPreview:i,audioPreview:u,uploadPreview:(e,t,a)=>{const o=e['media'];var e=o.name.split('.').pop(),e=['dae','abc','usd','usdc','usda','ply','stl','fbx','glb','gltf','obj','x3d'].includes(e),r=m(o,t,e),a=d(t,a,{media:o,is3d:e});let n=o.size,l='',s=0;for(var i=['KB','MB','GB'];1024<n&&s<i.length;)n=Math.round(n/1024),l=i[s],s+=1;return`
    <div class="card file-row" data-name="${o.name}">
      <div class="card-header" id="heading_${t}">
        <h5 class="mb-0" style="text-align:center">
          <button
            class="btn btn-link"
            data-toggle="collapse"
            data-target="#collapse_${t}"
            aria-expanded="true"
            aria-controls="collapse_${t}"
            title="${o.name}"
          >
          <b>${c(o.name,25)}</b> ${n} ${l}
          <span class="loader-container"></span>
          <p class="mt-2 mb-0 text-center"></p>
          </button>
          <a href="#" style="float:right" class="text-danger">
            <i
              style="vertical-align:middle"
              data-name="${o.name}"
              class="remove-media-btn las la-trash-alt">
            </i>
          </a>
        </h5>
      </div>
      <div
        id="collapse_${t}" 
        class="collapse ${0===t?'show':''}"
        aria-labelledby="heading_${t}"
        data-parent="#accordion">   
        <div class="card-body">
          ${r}
          ${a}
        </div>
      </div>
    </div>
  `},uploadFeedback:(e,t)=>`
<p
  class="mt-2 mb-0 text-${t} text-center">
  ${e}
</p>`,metadataForm:d,selectedMedia:({media_content:e,name:t,id:a})=>{var o=e?e.description:__('noDescription');return`
  <a
    href="#"
    data-media="${a}"
    class="selected-media list-group-item list-group-item-action flex-column align-items-start">
    <div class="d-flex w-100 justify-content-between">
      <div>
        <b class="mb-1 m-0">
          ${e?e.title:t}
        </b>
        </br>
        <small class="mb-1">${o}</small>
      </div>
      <div class="selected-media-preview">
        <img src="${e.preview}">
      </div>
    </div>
  </a>
`}}}},287:e=>{e.exports={request:(e,t,a='GET',o=!1,r=!1,n=!1)=>{const l=new Headers;r?Object.entries(r).forEach(([e,t])=>l.append(e,t)):l.append('Accept','application/json');let s=null;if(o){s=new FormData;for(var[i,c]of Object.entries(o))if(i&&c)if('object'==typeof c)if(Array.isArray(c))for(var[,d]of Object.entries(c))s.append(i+'[]',d);else c instanceof File?s.append(i,c):s.append(i,JSON.stringify(c));else s.append(i,c)}if('post'===a.toLowerCase()){let e=!1;r=document.querySelector('meta[name=csrf-token]');(e=void 0!==r?r.content:e)&&(s=null===s?new FormData:s).append('_token',e)}fetch(document.location.origin+e,{method:a,headers:l,body:s}).then(e=>e.json()).then(e=>t(e)).catch(e=>n?n(e):console.error(e))},truncate:(e,t,a='...')=>e.length>t?e.substring(0,t-a.length)+a:e,toast:(e,t='success')=>{new Noty({type:t,text:e}).show()},customEvent:(e,t={},a=window)=>{e=new CustomEvent(e,{detail:t});a.dispatchEvent(e)},arrayUniqueByKey:(e,t)=>[...new Map(e.map(e=>[e[t],e])).values()],getPossibleTranslation:e=>{var t=(e=>{try{return JSON.parse(e)}catch(e){return!1}})(e);return'string'==typeof t?t:t?void 0!==t.en?t.en:t[Object.keys(t).shift()]:e}}}},o={};function r(e){var t=o[e];if(void 0!==t)return t.exports;t=o[e]={exports:{}};return a[e](t,t.exports,r),t.exports}(()=>{'use strict';var e=r(479)['init'];window.onload=e})()})();