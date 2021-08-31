<template>
    <div>
        <!-- Selected Medias -->
        <input type="hidden" class="selected-medias-input" :name="name" />
        <div v-for="media in selectedMedias">
          <a @click="editSelectedMedia" :data-media="media.id">
            <slot name="selectedMedia" v-bind:media="media" />
          </a>
        </div>
        <!-- End Selected Medias -->

        <!-- Trigger -->
        <a 
            @click="instantiateField"
            type="button" 
            class="filemanager-toggle btn-primary btn"
        >
            <slot name="trigger" />
        </a>
        <!-- End Trigger -->

        <!-- File Manager Modal -->
        <b-modal 
          size="xl" 
          id="media-modal" 
          ref="media-modal" 
          title="Media Manager"
          @ok="onModalOk"
        >
            <div id="filemanager-container" class="col-12">
                <div class="custom-file-manager card">
                    <div class="card-header">
                        <ul class="list-inline">
                            <li class="list-inline-item">
                                <a id="upload-button">
                                    <i class="las la-upload"></i>
                                    Upload
                                </a>

                            </li>
                            <li class="list-inline-item">
                                <a id="asign-tag-button">
                                    <i class="las la-tag"></i>
                                    Asign Tag
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a id="unsign-tag-button">
                                    <i class="las la-trash"></i>
                                    Remove Tag
                                </a>
                            </li>
                            <li class="list-inline-item">
                                <a id="refreshBtn">
                                    <i class="las la-sync"></i>
                                    Refresh
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div class="selection-area-container card-body">
                        <div class="row">
                            <div class="tags-container col-sm-2">
                                <ul class="list-group">
                                </ul>
                            </div>
                            <div class="col-sm-10">
                                <div class="col-sm-12 d-flex justify-content-center m-0">
                                    <h4 class="media-loader d-none"><span class="la la-spinner la-spin mt-3"></span></h4>
                                </div>
                                <div class="selection-area list row my-2">
                                </div>
                            </div>
                        </div>
                    </div>
                    <input type="file" class="d-none" name="medias" size="chars" id="upload-field" multiple>
                </div>
            </div>
        </b-modal>
        <!-- End File Manager Modal -->

        <!-- Asign Tag Modal -->
        <b-modal size="sm" id="tag-modal" ref="asign-tag-modal" centered title="Asign Tag">
       
       </b-modal>
        <!-- End Asign Tag Modal -->
    </div>
</template>
<script>

const FileManager = require('./file-manager');
const {toast} = require('../utils');

export default {
  props : ['name', 'mediaType', 'min', 'max'],
  data(){
    return{
      selectedMedias: false,
      medias : false,
    }
  },
  mounted(){
    window.addEventListener(`change_${this.name}`, this.onMediasSelected)
  },
  methods: {
    instantiateField(){
      this.$refs['media-modal'].show()
      FileManager.default.init({
        name : this.name,
        mediaType: this.mediaType,
        min : this.min || 0,
        max : this.max || 10
      });
    },
    onMediasSelected({detail}){
      const selectedMedias = [];
      this.medias = detail.medias;
      this.medias.forEach(media => {
        if(detail.selectedMedias.includes(String(media.id))){
          selectedMedias.push(media);
        }
      })
      this.selectedMedias = selectedMedias;

      this.$refs['media-modal'].hide();
      toast(`Medias selected successfully`);
      this.$emit('save', this.selectedMedias)
    },
    editSelectedMedia(e){
      console.log('editing selected media', e)
      console.log('Edit media with ID: ', e.currentTarget.dataset.media);
    },
    onModalOk(e){
      e.preventDefault();
    }
  },
}
</script>

<style lang="scss">
  #upload-modal{
    .modal-body{
      overflow: auto;
      max-height: 70vh;
    }
    .confirm-crop{
      position: absolute;
      z-index: 1;
      margin: .25rem;
    }
  
    .medias-list{
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 3px;
      }
      &::-webkit-scrollbar-track {
        background: #f1f1f159;
      }
  
      &::-webkit-scrollbar-thumb {
        background: white;
      }
    }
  }
  
  #upload-modal, #tagModal{
    .invalid-feedback{
      display:block;
    }
  
    .file-row .card-header{
      background-color:#efefef;
    }
  }
  
  .selected-medias-list{
    margin-bottom:.3rem;
    a{
      margin-bottom: 1rem;
    }
    img{
      max-width: 4rem;
      max-height: 4rem;
    }
  }
  
  .custom-file-manager{
  
    .card-header{
      padding: .3rem;
  
      ul{
        margin:0;
        
        li{
          margin: 0;
          padding: .5rem 1rem;
          border-right: 1px solid #d9e2ef;
          cursor:pointer;
          a:hover{
            text-decoration: underline;
          }
          .selected{
            color: #eee;
            background-color: #7c69ef;
          }
        }
      }
    }
  
    .card-body{
      padding:0;
      margin:0;
  
      .tags-container{
        border-right: 1px solid #d9e2ef;
        max-height: 17rem;
        overflow: auto;
  
        ul li{
          margin: .25rem 0;
          text-align: center;
          padding: .25rem .75rem
        }
  
        ul li.selected{
          background-color: #d9e2ef;
        }
  
        ul > li:first-child{
          margin-top: .75rem;
        }
      }
  
      nav{
        margin: 1rem;
        .page-item{
          margin-right: .25rem;
        }
      }
  
      .selection {
        background-color: rgba(255, 255, 255, 0.5);
      }
  
      .selection-area {
        max-height: 17rem;
        padding-bottom: 10px!important;
        overflow: auto;
      }
  
      .selectable.selected {
        background: rgba(111, 112, 112, 0.329);
      }
  
      .selectable >*{
        user-select:none;
      }
  
      .row{
        display:flex;
        justify-content: center;
        padding:0;
        margin:0;
        .col-sm-3.selectable{
          display:flex;
          justify-content: center;
          margin-bottom:1rem;
            >*{
              user-select:none;
            }
  
            > img{
              margin: 1.3rem .25rem;
              max-width: 3rem;
            }
  
            > small {
              position: absolute;
              bottom:0;
            }
          
        }
      }
    }
  }

  // JQUERY UI

  .selection-area .ui-selecting { background: #7c69ef; color: white; }
  .selection-area .ui-selected { background: #7c69ef; color: white; }
</style>
