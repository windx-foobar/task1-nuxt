<template>
  <div>
    <b-tr class="w-100" :class="{ 'text-danger': !!file.error }">
      <b-td class="p-0" style="vertical-align: top">
        <!-- <sh-debug>{{ file }}</sh-debug> -->
        <b-link class="mr-2" v-if="file.isDownload" @click="$emit('download', file)">{{ file.originalName }}</b-link>
        <span class="mr-2" v-if="!file.isDownload">{{ file.originalName }}</span>

        <b-link @click="collapseViewImg">{{ viewImg ? "Скрыть" : "Просмотр" }}</b-link>
      </b-td>
      <b-td class="min-width text-right p-0" style="vertical-align: top">
        <b-btn v-if="file.id && canDelete" size="sm" variant="danger" @click="$emit('remove', file)"> удалить </b-btn>
        <sh-info v-if="file.error">
          {{ file.error }}
        </sh-info>
      </b-td>
    </b-tr>
    <b-tr>
      <b-td colspan="5">
        <b-img v-if="viewImg" height="150" :src="`${NUXT_API_URL}/api/files/${file.id}?show=1`" :alt="file.name" />
        <!-- <slot name="аdditional" :file="file" /> -->
      </b-td>
    </b-tr>
  </div>
</template>

<script>
export default {
  props: {
    preView: {
      type: Boolean,
      default: false,
    },
    canDelete: {
      type: Boolean,
      default: false,
    },
    preViewOpen: {
      type: Boolean,
      default: false,
    },
    fluid: {
      type: Boolean,
      default: true,
    },
    file: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      id: null,
      viewImg: false,
      NUXT_API_URL: process.env.NUXT_API_URL,
    };
  },

  methods: {
    collapseViewImg() {
      this.viewImg = !this.viewImg;
    },
  },
  mounted() {
    this.id = this._uid;

    if (this.preViewOpen) this.viewImg = true;
  },
};
</script>
