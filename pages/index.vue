<template>
  <div></div>
</template>

<script>
export default {
  layout: "public",
  middleware({ redirect }) {
    return redirect("/objects");
  },
};
</script>
