(()=>{var a={479:(e,t,a)=>{const g=a(693),{request:n,truncate:y,toast:c,arrayUniqueByKey:l}=a(287),b=a(838)["templates"];let s=[],r=null,o=1,m=[],h=[],i=!1,d=[];const u=(e,t=!0)=>{const a=document.querySelector(e+".selection-area");if(a){a.innerHTML="";const r=document.querySelector(e+".media-loader");r.classList.toggle("d-none",!t)}},p=e=>{const t=[];return document.querySelectorAll(e+" .selected .select-tag").forEach(e=>t.push(parseInt(e.dataset.tag,10))),t},v=e=>(selectedMedias=[],document.querySelectorAll(e+".selectable.ui-selected").forEach(e=>{selectedMedias.push(e.dataset.file)}),selectedMedias),f=(e=1,t=null,a=!1,r=!1)=>{n("/admin/media/fetch/media?page="+e,r,"POST",{_token:document.querySelector("meta[name=csrf-token]").content,tags:t,type:a})},S=e=>`
  <div
    title="${e.media_content.title}" 
    class="selectable col-md-2 col-sm-3 m-1" data-file="${e.id}">
    <img src="${e.media_content.preview}">
  </div>
`,_=(e,t)=>{return`
  <form id="metadata-form-${t}">
    ${`
    <div id="select2-container-${t}" class="form-group">
      
    </div>
  `}
    <div class="form-group">
      <label>${__("title")}</label>
      <input name="title" type="text" class="form-control">
    </div>
    <div class="form-group">
      <label>${__("description")}</label>
      <textarea name="description" class="form-control"></textarea>
    </div>
    ${(e=>{let t="";return e.forEach(e=>{t+=`<option value="${e.id}">${e.name}</option>`}),`
  <div class="form-group">
    <label>${__("mediaType")}</label>
    <select name="type" class="form-control">
      ${t}
    </select>
  </div>`})(e)}
  </form>`},w=(e,p)=>{console.log({medias:e,types:p});const v=document.querySelector("#upload-modal .medias-list");v.innerHTML="";let f=0;e.forEach(({media:e,is3d:t})=>{let a="",r=!1,n=!1;["video/avi"].includes(e.type)?a=`<small>${__("noPreview",[e.type])}</small>`:/^image/.test(e.type)?a="image/gif"!==e.type?(d=`
          <button id="crop-btn-${f}" class="form-control btn btn-default btn-sm crop-btn" data-id="${f}">
            ${__("crop")}
          </button>`,`
          <img
            id="image-preview-${f}" 
            class="w-100 my-3"
            src="${URL.createObjectURL(e)}">
          ${d}
          <div class="mt-1" id="crop_image_${f}">
            ${((e,t)=>{const a=document.createElement("img"),r=(a.classList.add("to_be_crop_"+t),a.style.maxWidth="100%",a.src=URL.createObjectURL(e),document.createElement("button"));return r.textContent="Confirm",r.classList="confirm-crop btn btn-default btn-sm",r.id="crop_btn_"+t,`
  <div class="d-none" id="imageCropper_${r.dataset.id=t}">
    ${r.outerHTML}
    ${a.outerHTML}
  </div>`})(e,f)}
          </div>
        `):`
          <img
            id="image-preview-${f}" 
            class="w-100 my-3"
            src="${URL.createObjectURL(e)}">
        `:/^video/.test(e.type)?(r=!0,a=`
        <video controls id="video-preview-video-${f}" class="w-100 my-3">
          <source id="video-preview-source-${f}" src="">
          Your browser does not support the video tag.
        </video>`):/^audio/.test(e.type)&&(n=!0,a=`
      <audio class="w-100 my-3" id="audio-preview-audio-${f}" controls>
        <source src="" id="audio-preview-source-${f}" />
      </audio>`);let o=e.size,l="",s=0;for(var i=["KB","MB","GB"];1024<o&&s<i.length;)o=Math.round(o/1024),l=i[s],s+=1;var d=b.metadataForm(f,p,{media:e,is3d:t});if(v.innerHTML+=`
      <div class="card file-row" data-name="${e.name}">
        <div class="card-header" id="heading_${f}">
          <h5 class="mb-0" style="text-align:center">
            <button
              class="btn btn-link"
              data-toggle="collapse"
              data-target="#collapse_${f}"
              aria-expanded="true"
              aria-controls="collapse_${f}"
              title="${e.name}"
            >
            <b>${y(e.name,25)}</b> ${o} ${l}
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
          id="collapse_${f}" 
          class="collapse ${0===f?"show":""}"
          aria-labelledby="heading_${f}"
          data-parent="#accordion">   
          <div class="card-body">
            ${a}
            ${d}
          </div>
        </div>
      </div>`,r){const m=new FileReader,u=f;m.onloadend=()=>{const e=document.querySelector("#video-preview-video-"+u);e.src=m.result},m.readAsDataURL(e)}n&&(document.querySelector("#audio-preview-source-"+f).src=URL.createObjectURL(e),document.querySelector("#audio-preview-audio-"+f).load());const c=document.querySelector("#select2-container-"+f);h.show?g.createGroupedField({container:c,name:"parentId",label:h.label,url:"/admin/media/fetch/parents",class:"form-control"}):h.id&&(c.innerHTML+=`
        <input type="text" value="${h.id}" name="parentId">
        <input type="text" value="${h.model}" name="parentModel">
      `),f+=1}),h.show&&g.initGroupedFields()},L=(s,i,d)=>{document.querySelectorAll(s+".selected-media").forEach(e=>{e.addEventListener("click",e=>{const t=e.currentTarget.dataset.media,[r]=i.filter(e=>String(e.id)===t),n=document.querySelector("#edit-media-modal"),o=(n.querySelector(".modal-body").innerHTML=_(m,r.id),n.querySelector(".modal-save").innerHTML="Save",n.querySelector('select[name="parentId"]')),a=(null!==o&&(o.value=r?r.parent_id:""),n.querySelector('input[name="title"]')),l=(a.value=r.media_content?r.media_content.title:"",n.querySelector('textarea[name="description"]'));l.value=r.media_content?r.media_content.description:"",n.querySelector(".modal-save").addEventListener("click",()=>{const e={title:n.querySelector('input[name="title"]').value,description:n.querySelector('textarea[name="description"]').value},a=(null!==o&&(e.parent=n.querySelector('select[name="parentId"]').value),new FormData);Object.entries(e).forEach(([e,t])=>{a.append(e,t)}),fetch(`/api/media/${r.media_content.id}/edit`,{method:"POST",body:a}).then(e=>e.json()).then(e=>{n.querySelectorAll("small.text-danger").forEach(e=>e.remove()),!e.errors&&e.data.updated?(document.querySelector(`${s}.selected-media[data-media="${r.id}"]`).outerHTML=b.selectedMedia(e.data.media),n.querySelector(".modal-save").innerHTML='<span class="modal-loader la la-spinner la-spin"></span>',u(s,!0),f(1,"",d,e=>{L(s,e.data,d),M(e,s,d),$(n).modal("hide"),c(__("mediaUpdated"))})):Object.entries(e.errors).forEach(([e,t])=>{const a=n.querySelector(`input[name="${e}"], textarea[name="${e}"], select[name="${e}"]`);t.forEach(e=>{a.parentElement.innerHTML+=`<small class="text-danger">${e}</small>`})})})}),$(n).modal("show")})})},q=(r,n,o)=>{$(".selection-area").selectable(),""!==n&&document.querySelector(n+"#selectFilesBtn").addEventListener("click",()=>{const t=v(n);let e;e=t.length?JSON.stringify({medias:t}):null,document.querySelector(n+" .selected-medias-input").value=e;const a=document.querySelector(n+".selected-medias-list");a.innerHTML="",document.querySelector(n+".selected-medias-number").innerHTML=""+t.length,0<t.length?(r.forEach(e=>{t.includes(String(e.id))&&(a.innerHTML+=b.selectedMedia(e))}),L(n,r,o)):a.innerHTML=`
            <li class="list-group-item">
              <small>${__("noMediasSelected")}</small>
            </li>
          `})},x=(a,e,r="",n)=>{let t=1,o=!1;$(a).off("scroll"),$(a).on("scroll",()=>{a.offsetHeight+a.scrollTop>=a.scrollHeight-1&&!o&&t+1<=e&&(t+=1,o=!0,a.innerHTML+=`
        <div class="pagination-loader col-sm-12 d-flex justify-content-center m-0">
          <h4><span class="la la-spinner la-spin mt-3"></span></h4>
        </div>`,f(t,p(r),n,e=>{a.querySelector(".pagination-loader").remove();const t=e.data;t.forEach(e=>{a.innerHTML+=S(e)}),s=l(s.concat(t),"id"),o=!1,""!==r&&q(s,r,n)}))})},M=(t,a,r=!1)=>{s=l(s.concat(t.data),"id"),u(a,!1);const n=document.querySelector(a+" .custom-file-manager .list");n.innerHTML="",t.data.length?t.data.forEach(e=>{n.innerHTML+=S(e),x(n,t.last_page,a,r),q(s,a,r)}):n.innerHTML=`
    <tr>
      <td class="empty" colspan="6">${__("noMediasFound")}</td>
    </tr>`},T=(t="",a=!1)=>{document.querySelector(t+"#refreshBtn").addEventListener("click",()=>{u(t,!0),f(1,"",a,e=>{M(e,t,a)})})};const E=(a,r)=>{const e=document.querySelector("#upload-modal .modal-title span"),t=document.querySelector("#upload-modal .modal-save"),n=t.querySelector("span");var o=a.length;w(a,r),t.classList.remove("d-none"),e.innerHTML=o,n.innerHTML=o;const l=document.querySelectorAll(".remove-media-btn");l.forEach(e=>{e.addEventListener("click",e=>{const t=e.target.dataset.name;a=a.filter(e=>e.media.name!==t),E(a,r)})}),$("#upload-modal .modal-save").off("click").on("click",s=>{s.currentTarget.classList.add("d-none");const o=[],t=[];let l=0;const e=document.querySelectorAll("span.loader-container");e.forEach(e=>{e.innerHTML+='<span class="ml-2 la la-spinner la-spin"></span>'}),a.forEach(e=>{const t=document.querySelectorAll(`#metadata-form-${l} .form-control`),a={};t.forEach(e=>a[e.name]=e.value);var r=document.querySelector(`#metadata-form-${l} select[name="parentId"]`),n=(null===r||void 0!==(n=$(r).find(":selected").data())&&(a.parent_model=n.namespace,a.parent_id=r.value),document.querySelector(`#metadata-form-${l} input[name="parentId"]`)),r=document.querySelector(`#metadata-form-${l} input[name="parentModel"]`);null!==n&&null!==r&&(a.parent_id=n.value,a.parent_model=r.value),o.push(((e,t)=>{const a=new FormData;return a.append("media",e.media),a.append("cropped",e.cropped||null),a.append("name",e.media.name),Object.entries(t).forEach(([e,t])=>{a.append(e,t)}),fetch("/api/media/upload",{method:"POST",body:a})})(e,a)),l+=1}),Promise.all(o).then(e=>{e.forEach(e=>{e.ok&&t.push(e.json())})},e=>console.log(e)).then(()=>{Promise.all(t).then(e=>{e.forEach(e=>{const r=document.querySelector(`.file-row[data-name="${e.data.filename}"]`);if(document.querySelectorAll("small.text-danger").forEach(e=>e.remove()),e.errors){if(r){Object.entries(e.errors).forEach(([e,t])=>{const a=r.querySelector(`input[name="${e}"], select[name="${e}"]`);t.forEach(e=>{a.parentElement.innerHTML+=`<small class="text-danger">${e}</small>`})});const a=r.querySelector("span.loader-container"),n=(a.innerHTML="❌",r.querySelector(".card-header p"));n.innerHTML=__("invalidMetadata"),n.classList.add("text-danger"),n.classList.remove("text-success"),$(r).find(".collapse").collapse("show"),s.currentTarget.classList.remove("d-none")}}else{var{msg:e,success:t}=e.data;const o=r.querySelector("span.loader-container");o.classList.value="ml-2",o.innerHTML=t?"✅":"❌";t=t?"success":"danger";const l=r.querySelector(".card-header p");l.textContent=e,l.classList.remove("text-danger"),l.classList.remove("text-success"),l.classList.add("text-"+t)}})})})}),$(".crop-btn").off("click").on("click",e=>{e=e.target.dataset.id;const t=document.querySelector("#imageCropper_"+e);{var a=e;e=document.querySelector(".to_be_crop_"+a);const r=new Cropper(e,{aspectRatio:"1/1"}),n=document.querySelector("#crop_btn_"+a);n.addEventListener("click",()=>{const e=r.getCroppedCanvas();null!==e&&e.toBlob(e=>{e.lastModifiedDate=new Date,e.lastModified=new Date;e=new File([e],d[a].media.name,{type:e.type});d[a].media=e,document.querySelector("#image-preview-"+a).src=URL.createObjectURL(e),$("#crop-btn-"+a).click(),c(__("imageCropped"))})})}Object.values(t.classList).includes("d-none")?t.classList.remove("d-none"):t.classList.add("d-none")})},j=(t="",a=!1)=>{const e=$("#upload-modal");e.on("shown.bs.modal",()=>{E(d,m)}),e.on("hidden.bs.modal",()=>{i=!1,u(t,!0),f(1,"",a,e=>{M(e,t,a)})})},O=e=>{const t=document.querySelector(e+" #upload-field");e=document.querySelector(e+" #upload-button");const a=$("#upload-modal");$(e).off("click"),$(e).on("click",()=>{t.value="",t.click()}),t.addEventListener("change",()=>{d=[],t.files.forEach(e=>{var t=e.name.split(".").pop();d.push({media:e,cropped:null,is3d:["dae","abc","usd","usdc","usda","ply","stl","fbx","glb","gltf","obj","x3d"].includes(t)})}),i||(a.modal("show"),i=!0)})},H=(e,t,a)=>{M(e,t,a),L(t,e.data,a);e=new Event("medias-loaded");document.querySelector(t+" #filemanager-container").dispatchEvent(e),T(t,a),O(t),j(t,a);{e=t;const r=document.querySelector(e+".browse-media-btn-container"),n=r.querySelector(".filemanager-toggle"),o=r.querySelector(".la-spinner");return n.disabled=!1,void o.remove()}},k=e=>{M(e,""),T(),O(""),j()},F=({data:e})=>{var{tags:e,types:t,parent:a}=e;r=e.data,o=e.last_page,m=t.data,h=a},R=e=>{F(e);const t=document.querySelector("template.upload-modal");e=t.content.cloneNode(!0);document.body.appendChild(e);const a=document.querySelectorAll(".filemanager-field.modal-dialog");a.length?a.forEach(e=>{var t=null!==e&&e.getAttribute("name");const a=t?`.filemanager-field[name="${t}"] `:"",r=e.dataset["type"];f(1,"",r,e=>{H(e,a,r)})}):f(1,"",!1,e=>{k(e)})};e.exports={init:()=>{var e;e=R,u("",!0),n("/admin/media/fetch/global-data",e,"POST")}}},693:(e,t,a)=>{const o=a(287)["getPossibleTranslation"];const r=(e,t)=>{return`
    <label>${e.label}</label>
    <select
      ${void 0!==e.id?`id="${e.id}"`:""}
      name="${e.name}"
      style="${e.style||"width:100%"}"
      class="${e.class||"form-control"} ${t}"
      data-url="${e.url}"
    >
    </select>`};e.exports={createGroupedField:e=>{var t=r(e,"select2-grouped");e.container.innerHTML+=t},initGroupedFields:(e=document)=>{e.querySelectorAll(".select2-grouped").forEach(e=>{var t=e.dataset["url"];const n=[];$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),$(e).select2({theme:"bootstrap",multiple:!1,ajax:{url:t,type:"POST",dataType:"json",data:e=>{return{search:e.term,page:e.page||1}},processResults({data:e}){var t=Object.keys(e).length;const a=[];let r;return 1<t?(Object.entries(e).forEach(([t,e])=>{e.current_page===e.last_page&&n.push(t),e.data.length&&a.push({text:t.split("\\").pop(),children:Object.values(e.data).map(e=>({id:e.id,text:o(JSON.stringify(e.name)),namespace:t}))})}),r=n.length<t):Object.entries(e).forEach(([t,e])=>{Object.values(e.data).forEach(e=>{a.push({id:e.id,text:o(JSON.stringify(e.name)),namespace:t})}),r=e.current_page<e.last_page}),console.log({results:a}),{results:a,pagination:{more:r}}}}}).on("select2:select",e=>{var t=e.params["data"];$(e.currentTarget).children()[0].dataset.namespace=t.namespace})})},createAjaxField:e=>{var t=r(e,"select2-ajax");e.container.innerHTML=t},initAjaxField:e=>{var e=document.querySelector("#"+e),t=e.dataset["url"];$.ajaxSetup({headers:{"X-CSRF-TOKEN":$('meta[name="csrf-token"]').attr("content")}}),$(e).select2({theme:"bootstrap",multiple:!1,ajax:{url:t,type:"POST",dataType:"json",data:e=>{return{search:e.term,page:e.page||1}},processResults({data:e,current_page:t,last_page:a}){const r=[];return Object.values(e).forEach(e=>{r.push({id:e.id,text:o(JSON.stringify(e.name))})}),more=t<a,{results:r,pagination:{more:more}}}}})}}},838:(e,t,a)=>{const d=a(287)["truncate"];const r=e=>e.map(e=>`
  <option value="${e.id}">
    ${e.name}
  </option>
`);const c=(e,t,{media:a,is3d:r})=>{let{name:n,type:o}=a;r&&(o="model");a=l(t,o);return`
    <form id="metadata-form-${e}">
      ${`
    <div id="select2-container-${e}" class="form-group">
      
    </div>
  `}
      <div class="form-group">
        <label>Title</label>
        <input name="title" type="text" class="form-control" value="${n.split(".").shift()}">
      </div>
      <div class="form-group">
        <label>Description</label>
        <textarea name="description" class="form-control"></textarea>
      </div>
      ${a}
    </form>`},l=(e,t)=>{let a="",r;return/^image/.test(t)?[r]=e.filter(e=>"image"===e.key):/^video/.test(t)?[r]=e.filter(e=>"video"===e.key):/^audio/.test(t)?[r]=e.filter(e=>"audio"===e.key):/^model/.test(t)&&([r]=e.filter(e=>"3d_model"===e.key)),e.forEach(e=>{a+=`<option ${r.id===e.id?"selected":""} value="${e.id}">${e.name}</option>`}),`
  <div class="form-group">
    <label>Media Type</label>
    <select name="type" class="form-control">
      ${a}
    </select>
  </div>`},m=(e,t,a)=>{var r=e["type"];let n="";return a?n="3D Model Preview":["video/avi"].includes(r)?n=o(r):/^image/.test(r)?n=s(e,t):/^video/.test(r)?n=i(t):/^audio/.test(r)&&(n=u(t)),n},o=e=>`
  <small>No preview available for type ${e}</small>
`,s=(e,t)=>{let a="";return["image/gif"].includes(e.type)||(a=`
    <button id="crop-btn-${t}" class="form-control btn btn-default btn-sm crop-btn" data-id="${t}">
      Crop
    </button>
    <div class="mt-1" id="crop_image_${t}">
      ${n(e,t)}
    </div>
    `),`
    <img
      id="image-preview-${t}" 
      class="w-100 my-3"
      src="${URL.createObjectURL(e)}"
    >
    ${a}
  `},n=(e,t)=>{const a=document.createElement("img"),r=(a.classList.add("to_be_crop_"+t),a.style.maxWidth="100%",a.src=URL.createObjectURL(e),document.createElement("button"));return r.textContent="Confirm",r.classList="confirm-crop btn btn-default btn-sm",r.id="crop_btn_"+t,`
  <div class="d-none" id="imageCropper_${r.dataset.id=t}">
    ${r.outerHTML}
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
</div>`,noMediasFound:()=>"<p>No Medias Found<p>",tagItem:e=>`
<li class="list-group-item">
  <a href="#" title="${e.name}" class="select-tag" data-tag="${e.id}">
    ${d(e.name,10)}
  </a>
</li>
`,noTagsFound:()=>'<li  class="list-group-item">No Tags</li>',tagsSelectOptions:r,tagsSelect:e=>{return`
  <select name="tags" class="tags-select form-control">
  ${r(e)}
  </select>`},tagsLoader:()=>'<span class="w-100 text-center tags-loader la la-spinner la-spin mt-3"></span>',uploadModalTitle:e=>`
  Uploading <span class="medias-count">${e}</span> medias
`,mediaPreview:m,noPreview:o,imagePreview:s,videoPreview:i,audioPreview:u,uploadPreview:(e,t,a)=>{const r=e["media"];var e=r.name.split(".").pop(),e=["dae","abc","usd","usdc","usda","ply","stl","fbx","glb","gltf","obj","x3d"].includes(e),n=m(r,t,e),a=c(t,a,{media:r,is3d:e});let o=r.size,l="",s=0;for(var i=["KB","MB","GB"];1024<o&&s<i.length;)o=Math.round(o/1024),l=i[s],s+=1;return`
    <div class="card file-row" data-name="${r.name}">
      <div class="card-header" id="heading_${t}">
        <h5 class="mb-0" style="text-align:center">
          <button
            class="btn btn-link"
            data-toggle="collapse"
            data-target="#collapse_${t}"
            aria-expanded="true"
            aria-controls="collapse_${t}"
            title="${r.name}"
          >
          <b>${d(r.name,25)}</b> ${o} ${l}
          <span class="loader-container"></span>
          <p class="mt-2 mb-0 text-center"></p>
          </button>
          <a href="#" style="float:right" class="text-danger">
            <i
              style="vertical-align:middle"
              data-name="${r.name}"
              class="remove-media-btn las la-trash-alt">
            </i>
          </a>
        </h5>
      </div>
      <div
        id="collapse_${t}" 
        class="collapse ${0===t?"show":""}"
        aria-labelledby="heading_${t}"
        data-parent="#accordion">   
        <div class="card-body">
          ${n}
          ${a}
        </div>
      </div>
    </div>
  `},uploadFeedback:(e,t)=>`
<p
  class="mt-2 mb-0 text-${t} text-center">
  ${e}
</p>`,metadataForm:c,selectedMedia:({media_content:e,name:t,id:a})=>{var r=e?e.description:__("noDescription");return`
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
        <small class="mb-1">${r}</small>
      </div>
      <div class="selected-media-preview">
        <img src="${e.preview}">
      </div>
    </div>
  </a>
`}}}},287:e=>{e.exports={request:(e,t,a="GET",r=!1,n=!1,o=!1)=>{const l=new Headers;n?Object.entries(n).forEach(([e,t])=>l.append(e,t)):l.append("Accept","application/json");let s=null;if(r){s=new FormData;for(var[i,d]of Object.entries(r))if(i&&d)if("object"==typeof d)if(Array.isArray(d))for(var[,c]of Object.entries(d))s.append(i+"[]",c);else d instanceof File?s.append(i,d):s.append(i,JSON.stringify(d));else s.append(i,d)}if("post"===a.toLowerCase()){let e=!1;n=document.querySelector("meta[name=csrf-token]");(e=void 0!==n?n.content:e)&&(s=null===s?new FormData:s).append("_token",e)}fetch(document.location.origin+e,{method:a,headers:l,body:s}).then(e=>e.json()).then(e=>t(e)).catch(e=>o?o(e):console.error(e))},truncate:(e,t,a="...")=>e.length>t?e.substring(0,t-a.length)+a:e,toast:(e,t="success")=>{new Noty({type:t,text:e}).show()},customEvent:(e,t={},a=window)=>{e=new CustomEvent(e,{detail:t});a.dispatchEvent(e)},arrayUniqueByKey:(e,t)=>[...new Map(e.map(e=>[e[t],e])).values()],getPossibleTranslation:e=>{var t=(e=>{try{return JSON.parse(e)}catch(e){return!1}})(e);return"string"==typeof t?t:t?void 0!==t.en?t.en:t[Object.keys(t).shift()]:e}}}},r={};function n(e){var t=r[e];if(void 0!==t)return t.exports;t=r[e]={exports:{}};return a[e](t,t.exports,n),t.exports}(()=>{"use strict";var e=n(479)["init"];const l=n(838)["templates"];window.onload=e,window.FileManagerAPI={renderSelectedMedias:(e,t)=>{const a=document.querySelector(`.filemanager-field[name="${e}"]`),r=a.querySelector(".selected-medias-list"),n=a.querySelector(".selected-medias-number"),o=(n.textContent=t.length,r.innerHTML="",t.forEach(e=>{r.innerHTML+=l.selectedMedia(e)}),a.querySelector(".selected-medias-input"));o.value=JSON.stringify({medias:t.map(e=>e.id)})}}})()})();