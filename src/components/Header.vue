<template>
  <div id="header">
    <span class="g-back"></span>
    <h1 class="g-title">{{title}}</h1>
    <span class="g-user"></span>
  </div>
</template>

<script>
export default {
  name: 'VHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  }
};
</script>

<style lang="scss">
#header {
  position: relative;
  z-index: 100;
  display: flex;
  height: 52px;
  padding: 0 16px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 0 1px 3px rgba(26, 26, 26, 0.1);
  align-items: center;
  .g-back {
    flex: 1;
    text-align: left;
    cursor: pointer;
  }
  .g-title {
    flex: 3;
    text-align: center;
  }
  .g-user {
    flex: 1;
    text-align: right;
    cursor: pointer;
  }
}
</style>
