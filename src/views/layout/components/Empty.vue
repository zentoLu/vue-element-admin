<template>
    <router-view :key="key"></router-view>
</template>

<script>
export default {
  name: 'Empty',
  computed: {
    key() {
      return this.$route.fullPath
    }
  }
}
</script>
