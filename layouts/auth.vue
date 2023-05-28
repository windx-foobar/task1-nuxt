<template>
  <div class="container-fluid">
    <nuxt />
    <notifications position="top right" />
  </div>
</template>

<script>
export default {
  middleware: [
    ({ $auth, redirect }) => {
      if ($auth.loggedIn) {
        redirect(301, { name: "me", replace: true });
        return;
      }
    },
  ],

  head() {
    return {};
  },
};
</script>

<style lang="scss"></style>
