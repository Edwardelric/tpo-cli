<template>
  <div>
    <router-view>
      <keep-alive></keep-alive>
    </router-view>
    <a :href="'/#/storeselect?storeId=2&cityName=%E4%B8%8A%E6%B5%B7&longitude=121.3641&latitude=31.2203&&forwardUrl='+ src">go to store list</a>
  </div>

</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        src: encodeURIComponent(window.location.href)
      }
    },
    created() {},
    mounted() {}
  };
</script>

<style lang="scss">

</style>
