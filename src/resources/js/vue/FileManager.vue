<template>
  <div>
    <!-- Selected Medias -->
    <input type="hidden" class="selected-medias-input" :name="name" />
    <div v-for="media in selectedMedias" :key="media.id">
      <a @click="editSelectedMedia" :data-media="media.id">
        <slot name="selectedMedia" v-bind:media="media" />
      </a>
    </div>
    <!-- End Selected Medias -->

    <!-- Trigger -->
    <a
      @click="instantiateField"
      type="button"
      :class="`filemanager-toggle ${triggerClasses}`"
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
              <!-- <li class="list-inline-item">
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
                            </li> -->
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
              <!-- <div class="tags-container col-sm-2">
                                <ul class="list-group">
                                </ul>
                            </div> -->
              <div class="col-sm-12">
                <div
                  class="loader-container col-sm-12 d-flex justify-content-center m-0"
                >
                  <h4 class="media-loader">
                    <span class="la la-spinner la-spin mt-3"></span>
                  </h4>
                </div>
                <div class="selection-area list row my-2"></div>
              </div>
            </div>
          </div>
          <input
            type="file"
            class="d-none"
            name="medias"
            size="chars"
            id="upload-field"
            multiple
          />
        </div>
      </div>
    </b-modal>
    <!-- End File Manager Modal -->

    <!-- Asign Tag Modal -->
    <b-modal size="sm" id="tag-modal" ref="tag-modal"></b-modal>
    <!-- End Asign Tag Modal -->

    <!-- Upload Modal -->
    <b-modal
      @hidden="onUploadModalCLose"
      @ok="onUploadModalOk"
      size="md"
      id="upload-modal-vue"
      ref="upload-modal-vue"
    >
      <div id="accordion" class="medias-list"></div>
    </b-modal>
    <!-- End Upload Modal -->

    <!-- Edit Media Modal -->
    <b-modal
      @ok="onEditModalOk"
      @shown="onEditModalShown"
      size="md"
      id="edit-media-modal"
      ref="edit-media-modal"
    ></b-modal>
    <!-- End Edit Media Modal -->
  </div>
</template>
<script>
const FileManager = require("./file-manager");
const { toast, customEvent } = require("../utils");

export default {
  props: [
    "name",
    "mediaType",
    "min",
    "max",
    "triggerClasses",
    "asignedMedias",
    "extensions",
  ],
  data() {
    return {
      selectedMedias: false,
      medias: false,
    };
  },
  mounted() {
    $(window)
      .off(`change_${this.name}`)
      .on(`change_${this.name}`, this.onMediasSelected);
    $(window)
      .off(`asign_tag_${this.name}`)
      .on(`asign_tag_${this.name}`, this.onAsignTag);
    $(window)
      .off(`unsign_tag_${this.name}`)
      .on(`unsign_tag_${this.name}`, this.onUnsignTag);
    $(window)
      .off(`upload_modal_open_${this.name}`)
      .on(`upload_modal_open_${this.name}`, this.onUploadModalOpen);
    $(window)
      .off(`loaded_new_page_${this.name}`)
      .on(`loaded_new_page_${this.name}`, this.onPageLoaded);
    $(window).off(`loaded_${this.name}`).on(`loaded_${this.name}`, this.onLoad);
    $(window)
      .off(`updated_media_${this.name}`)
      .on(`updated_media_${this.name}`, this.onMediaUpdated);
    $(window)
      .off(`on_refresh_${this.name}`)
      .on(`on_refresh_${this.name}`, this.onRefresh);

    if (this.asignedMedias.length) this.fetchAsignedMedias();
  },
  methods: {
    fetchAsignedMedias() {
      const body = new FormData();
      body.append("medias", this.asignedMedias);

      fetch(`${window.location.origin}/admin/media/fetch/media`, {
        method: "POST",
        body,
        headers: {
          "X-CSRF-TOKEN": document.querySelector("meta[name=csrf-token]")
            .content,
        },
      })
        .then((res) => res.json())
        .then(({ data }) => this.onAsignedMedias(data))
        .catch((err) => console.log(err));
    },

    onAsignedMedias(medias) {
      console.log("Medias ready for editing:", medias);
      this.$emit("save", medias);
    },

    instantiateField() {
      this.$refs["media-modal"].show();
      FileManager.default.init({
        name: this.name,
        mediaType: this.mediaType,
        min: this.min || 0,
        max: this.max || 10,
      });
    },

    onMediasSelected({ detail }) {
      const selectedMedias = [];
      this.medias.forEach((media) => {
        if (detail.selectedMedias.includes(String(media.id))) {
          selectedMedias.push(media);
        }
      });
      this.selectedMedias = selectedMedias;
      this.$refs["media-modal"].hide();
      toast(`Medias selected successfully`);
      this.$emit("save", this.selectedMedias);
    },

    onMediaUpdated({ detail }) {
      const { media } = detail;
      this.selectedMedias = this.selectedMedias.map((m) => {
        if (m.id === media.id) {
          return media;
        }
        return m;
      });
      toast("Media updated with success");
      this.$refs["edit-media-modal"].hide();
    },

    onAsignTag() {
      this.$refs["tag-modal"].show();
    },

    onUnsignTag() {
      this.$refs["tag-modal"].show();
    },

    onUploadModalOpen() {
      this.$refs["upload-modal-vue"].show();
      this.getExtensions();
    },

    onUploadModalCLose() {
      customEvent(`upload_modal_close_${this.name}`);
    },

    editSelectedMedia(e) {
      this.$refs["edit-media-modal"].show();
      this.editedMediaId = e.currentTarget.dataset.media;
    },
    onEditModalShown() {
      customEvent(`edit_media_${this.name}`, {
        mediaId: this.editedMediaId,
        medias: this.selectedMedias,
      });
    },
    onEditModalOk(e) {
      e.preventDefault();
    },
    onModalOk(e) {
      e.preventDefault();
    },
    onUploadModalOk(e) {
      e.preventDefault();
    },
    onPageLoaded({ detail }) {
      this.medias = this.medias.concat(detail.medias);
    },
    onLoad({ detail }) {
      this.medias = [];
      this.medias = detail.medias;
    },
    onRefresh({ detail }) {
      this.medias = detail;
      this.selectedMedias = [];
    },
    getExtensions() {
      customEvent(`get_extensions_${this.name}`, {
        // extensions: this.extensions,
        mediaType: this.mediaType,
      });
    },
  },
};
</script>

<style lang="scss">
#upload-modal-vue {
  .modal-body {
    overflow: auto;
    max-height: 70vh;
  }
  .confirm-crop {
    position: absolute;
    z-index: 1;
    margin: 0.25rem;
  }

  .medias-list {
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

#upload-modal-vue,
#tagModal {
  .invalid-feedback {
    display: block;
  }

  .file-row .card-header {
    background-color: #efefef;
  }
}

.selected-medias-list {
  margin-bottom: 0.3rem;
  a {
    margin-bottom: 1rem;
  }
  img {
    max-width: 4rem;
    max-height: 4rem;
  }
}

.custom-file-manager {
  .card-header {
    padding: 0.3rem;

    ul {
      margin: 0;

      li {
        margin: 0;
        padding: 0.5rem 1rem;
        border-right: 1px solid #d9e2ef;
        cursor: pointer;
        a:hover {
          text-decoration: underline;
        }
        .selected {
          color: #eee;
          background-color: #7c69ef;
        }
      }
    }
  }

  .card-body {
    padding: 0;
    margin: 0;

    .tags-container {
      border-right: 1px solid #d9e2ef;
      max-height: 17rem;
      overflow: auto;

      ul li {
        margin: 0.25rem 0;
        text-align: center;
        padding: 0.25rem 0.75rem;
      }

      ul li.selected {
        background-color: #d9e2ef;
      }

      ul > li:first-child {
        margin-top: 0.75rem;
      }
    }

    nav {
      margin: 1rem;
      .page-item {
        margin-right: 0.25rem;
      }
    }

    .selection {
      background-color: rgba(255, 255, 255, 0.5);
    }

    .selection-area {
      max-height: 17rem;
      padding-bottom: 10px !important;
      overflow: auto;
    }

    .selectable.selected {
      background: rgba(111, 112, 112, 0.329);
    }

    .selectable > * {
      user-select: none;
    }

    .row {
      display: flex;
      justify-content: center;
      padding: 0;
      margin: 0;
      .col-sm-3.selectable {
        display: flex;
        justify-content: center;
        margin-bottom: 1rem;
        > * {
          user-select: none;
        }

        > img {
          margin: 1.3rem 0.25rem;
          max-width: 3rem;
        }

        > small {
          position: absolute;
          bottom: 0;
        }
      }
    }
  }
}

// JQUERY UI
.selection-area .ui-selecting {
  background: #9789e7;
  color: white;
}
.selection-area .ui-selected {
  background: #7c69ef;
  color: white;
}
</style>
