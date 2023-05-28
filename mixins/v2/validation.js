export default {
  methods: {
    async setErrors(errors) {
      console.log("@m setErrors", errors, this._name);
      await this.reset();
      await this.$refs["form"]?.setErrors(errors);
    },
    async reset() {
      await this.$refs["form"]?.reset();
    },
  },
};
