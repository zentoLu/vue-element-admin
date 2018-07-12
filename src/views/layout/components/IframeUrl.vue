<template>
    <iframe :src="key" width="100%" height="100%" frameborder="0" scrolling="yes"></iframe>
</template>

<script>
export default {
  name: 'IframeUrl',
  computed: {
    key() {
      //console.log(this.$route)
      return this.$route.meta.iframeUrl
    }
  }
}
</script>
