<template>
  <div>
    <div v-if="$fetchState.pending" class="d-flex justify-content-center align-items-center">
      <b-spinner />
    </div>
    <div v-else data-testid="is-ready">
      <div class="row">
        <sh-input class="col-12" v-model="form.payload.name" label="название" />
        <sh-input class="col-12" v-model="form.payload.price" label="цена" />
        <sh-input
          class="col-12"
          type="select"
          v-model="form.objectCategoryId"
          :options="objectCategoriesLst"
          label="категория"
        />
      </div>

      <h3>Время работы</h3>

      <div v-for="(item, key) in daysLst" :key="key" class="row">
        <h5 class="col-3">{{ item }}</h5>
        <sh-input class="col-3" type="select" v-model="form.payload.workTime[key][0]" :options="timesLst" label="с" />
        <sh-input class="col-3" type="select" v-model="form.payload.workTime[key][1]" :options="timesLst" label="по" />
      </div>

      <!--<b-alert v-if="isNew" :show="true" variant="info">Прикрепить файлы можно после создания карточки</b-alert>-->
      <div class="mb-3">
        <common-upload-files
          :ref="`common-upload-files`"
          :has-files="!!files.length"
          :files="files"
          btn-size="sm"
          :upload-btn="true"
          :can-delete="true"
          @download="downloadFiles"
          @upload="upload"
          @input="($e) => addFiles($e, {})"
          @remove="($e) => removeFile($e, {})"
        >
          <template #аdditional="{ file }">
            <sh-input
              :name="`access-${file.id}`"
              fieldName="Тип файла"
              fg-class="mb-0"
              type="select"
              v-model="file.type"
              :__value="file.type"
              @__select="($e) => onFileTypeChange($e, file)"
              :options="attachmentTypesLst"
              rules="required"
              :disabled="!!file.id"
              style="width: 348px"
            />
          </template>
        </common-upload-files>
      </div>

      <div class="row">
        <div class="col">
          <b-btn v-if="!isNew" block @click="remove" variant="danger">Удалить</b-btn>
        </div>
        <div v-if="canPublish" class="col">
          <b-btn block @click="publish">отправить на проверку</b-btn>
        </div>
        <div class="col">
          <b-btn block @click="save">Сохранить</b-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash';
import { normalize, serialize } from '~/utils/v2/json/object';

const MODEL = {
  status: 1,
  objectCategoryId: null,
  payload: {
    name: ''
  }
};

const FILE_MODEL = {
  id: null,
  name: '',
  file: null
};

const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

let TIMES = Array(23).fill({});
TIMES = TIMES.map((item, key) => ({ id: key + 1, name: key < 10 ? `0${key}:00` : `${key}:00` }));

console.log(TIMES);

export default {
  components: {},
  mixins: [],
  head() {
    return {};
  },

  data() {
    return {
      form: {},
      files: [],
      objectCategoriesLst: [],
      //
      daysLst: [...DAYS],
      timesLst: [...TIMES]
    };
  },

  computed: {
    isNew() {
      return this.$route.params?.id === 'new';
    },
    canPublish() {
      return this.form?.status === 1 && !this.isNew;
    }
  },
  watch: {},
  methods: {
    async save() {
      try {
        if (this.isNew) {
          const { id } = await this.$axios.$post(`/api/me/objects`, {
            ...this.form,
            files: this.files.filter(({ id }) => !!id).map(({ id }) => id)
          });
          if (id) {
            const newPath = this.$route.path.replace('/new', `/${id}`);
            this.$router.push(newPath);
          }
        } else {
          const { id, ...form } = this.form;
          await this.$axios.$put(`/api/me/objects/${id}`, form);
        }
      } catch (e) {
        this.handleError(e);
      }
    },
    async publish() {
      if (!this.canPublish) return;

      try {
        const { id } = this.form;
        await this.$axios.$put(`/api/me/objects/${id}/publish`);
      } catch (e) {
        this.handleError(e);
      }
    },
    async remove() {
      try {
        const { id } = this.form;
        await this.$axios.$delete(`/api/me/objects/${id}`);
        const newPath = this.$route.path.replace(`/${id}`, ``);
        this.$router.push(newPath);
      } catch (e) {
        this.handleError(e);
      }
    },
    async removeFile(item, options) {
      try {
        await this.$axios.$delete(`/api/files/${item.id}`);

        // if (data.status === "success") {
        this.files = this.files.filter((file) => {
          if (file.id) return file.id !== item.id;
          else if (file._id) return file._id !== item._id;
          return true;
        });
        // }
      } catch (e) {
        this.handleError(e);
      }
    },

    async addFiles(event, options) {
      // console.log(">> addFiles", event, options);
      try {
        if (event.length) {
          await Promise.all([
            event.forEach(async (file) => {
              // console.log(file);
              // if (file.size < 1024 * 1024 * 8) {
              const item = Object.assign({}, FILE_MODEL, {
                id: null,
                _id: Math.random(),
                name: file.name,
                file
              });

              this.files.push(item);
            })
          ]);

          await this.upload(this.files);
        }
      } catch (error) {
        this.handleError(error);
      }
    },

    async upload(files) {
      console.log('__upload', files);
      try {
        // const isValid = await this.$refs.form.validate();
        // if (!isValid) throw new Error("Форма содержит ошибки");

        for (const key in files) {
          const file = files[key];
          try {
            if (!file.id && !file.error) {
              const dataForm = new FormData();
              dataForm.append('name', file.name);
              dataForm.append('parent', 'objects');
              dataForm.append('payload', JSON.stringify({}));
              dataForm.append('file', file.file);

              const data = await this.$axios.$post(`/api/files`, dataForm);
              console.log('DD', data);
              files.splice(key, 1, data);
            }
          } catch (error) {
            console.error(error);
            const { validationErrors = {} } = error?.response?.data ?? {};
            if (Array.isArray(validationErrors?.file)) {
              this.$set(file, 'error', validationErrors.file.join('\r\n'));
              this.$notify({
                type: 'error',
                text: validationErrors.file.join('\r\n')
              });
            } else {
              this.$set(file, 'error', 'Ошибка загрузки');
            }
          }
        }
      } catch (error) {
        console.error(error);
        this.handleError(new Error('Документы не загружены'));
      }
    },

    async downloadFiles({ url }) {
      // try {
      //   const { data, headers } = await this.$axios.get(url, {
      //     responseType: "blob",
      //     timeout: 30000,
      //   });
      //   const appFilename = headers["app-filename"];
      //   if (!appFilename) throw new Error("Не получено имя файла");
      //   downloadFileUtil({
      //     content: [data],
      //     name: appFilename,
      //   });
      // } catch (error) {
      //   this.handleError(error);
      // }
    }
  },
  async fetch() {
    const { rows: lst } = await this.$axios.$get(`/api/lst/object-categories`);
    this.objectCategoriesLst = lst;

    if (this.isNew) {
      this.form = normalize(MODEL);
    } else {
      const data = await this.$axios.$get(`/api/me/objects/${this.$route.params?.id}`);
      const _data = normalize(data);
      this.form = _data;
      this.files = cloneDeep(_data.files);
    }
  }
};
</script>
