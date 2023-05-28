<template>
  <div class="common-upload-files">
    <b-form-file
      ref="uploadData"
      class="common-upload-files"
      v-model="filesUpload"
      :multiple="multiple"
      :placeholder="compPlaceholder"
      :drop-placeholder="compPlaceholder"
      :accept="accept"
      @input="input" />

    <div v-if="hasFiles">
      <b-table-simple small borderless class="bUpload__table bg-transparent mb-0">
        <b-tbody>
          <template v-for="(file, index) in files">
            <common-upload-item
              :file="file"
              :pre-view="preView"
              :pre-view-open="previewOpen"
              :fluid="fluid"
              :canDelete="canDelete"
              @download="$emit('download', $event)"
              @remove="$emit('remove', $event)"
              @collapse-view-img="$emit('collapse-view-img', $event)"
              :key="index">
              <template #аdditional="props">
                <slot name="аdditional" :file="props.file" :index="index" />
              </template>
            </common-upload-item>
          </template>
        </b-tbody>
      </b-table-simple>

      <!-- <div class="mb-3">
        <div class="row">
          <div class="col">
            <b-btn
              v-if="multiple && maxFiles > files.length"
              variant="link"
              class="px-0"
              :size="btnSize"
              @click="openUploadDialog">
              +
            </b-btn>
          </div>
          <div class="col-auto ml-auto">
            <sh-btn v-if="uploadBtn" :loading="loadingBtn" :size="btnSize" @click="$emit('upload', files)">
              Загрузить выбранные
            </sh-btn>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import commonUploadItem from "./commonUploadItem";

export default {
  components: { commonUploadItem },

  props: {
    hasFiles: {
      type: Boolean,
      default: false,
    },
    files: {
      type: Array,
      default: () => [],
    },
    uploadBtn: {
      type: Boolean,
      default: true,
    },
    addBtn: {
      type: Boolean,
      default: true,
    },
    btnSize: {
      type: String,
      default: "",
    },
    loadingBtn: {
      type: Boolean,
      default: false,
    },
    preView: {
      type: Boolean,
      default: false,
    },
    previewOpen: {
      type: Boolean,
      default: false,
    },
    fluid: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: true,
    },
    maxFiles: {
      type: Number,
      default: 9999,
    },
    accept: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      id: null,
      filesUpload: [],
    };
  },

  computed: {
    compPlaceholder() {
      if (this.placeholder) {
        return this.placeholder.replace("$accept", this.accept);
      }
      return "Загрузите файлы или перетащите их в эту область";
    },
  },

  methods: {
    isDropActive() {
      return this.$refs.uploadData && this.$refs.uploadData.dropActive;
    },

    openUploadDialog() {
      this.$refs.uploadData.$el.querySelector("input").click();
    },

    input(event) {
      if (this.multiple) {
        let filesCount = this.maxFiles - this.files.length;
        this.$emit(
          "input",
          event.filter((item, index) => {
            if (this.accept !== "" && !this.accept.includes(item.type)) {
              this.handleError(new Error(`Допускается загрузка только ${this.accept}`));
              return false;
            }
            return index < filesCount;
          })
        );
      } else {
        this.$emit("input", event);
      }

      this.$refs.uploadData.reset();
    },
  },
  mounted() {
    this.id = this._uid;
  },
};
</script>
