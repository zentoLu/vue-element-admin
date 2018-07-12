<template>
  <section class="app-main" style="min-height: 100%">
  <div class="site-content" :style="height">
    <transition name="fade-transform" mode="out-in">
      <keep-alive :include="cachedViews">
        <router-view :key="key"></router-view>
      </keep-alive>
    </transition>
  </div>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  data: function() {
    return {
      height: ''
    }
  },
  created() {
    this.height = 'height:' + (document.documentElement.clientHeight - 90) + 'px'
    window.onresize = () => {
      this.height = 'height:' + (document.documentElement.clientHeight - 90) + 'px'
    }
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>
