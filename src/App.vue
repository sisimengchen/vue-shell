<template>
  <div id="app">
    <VHeader title="标题"></VHeader>
    <input class="passinput" v-model="passwords" placeholder="请输入6位密码">
    <UIKeyboard v-model="code"></UIKeyboard>
    <router-view></router-view>
  </div>
</template>

<script>
import VHeader from './components/Header';
import UIKeyboard from './components/Keyboard';

export default {
  name: 'App',
  components: {
    VHeader,
    UIKeyboard
  },
  data: function() {
    return {
      code: {},
      passwords: ''
    };
  },
  watch: {
    code: function(code, ocode) {
      if (this.passwords.length === 0 && code.key === 'delete') {
        return;
      }
      if (this.passwords.length == 6 && code.key != 'delete') {
        return;
      }
      if (code.key === 'delete') {
        this.passwords = this.passwords.slice(0, this.passwords.length - 1);
      } else {
        this.passwords = this.passwords + code.key;
      }
      if (this.passwords.length == 6 && code.key != 'delete') {
      }
    }
  }
};
</script>

<style lang="scss">
@import "./index.scss";
#app {
  .passinput {
    display: block;
    width: 100%;
    min-height: 52px;
    margin: 20px 0;
    text-indent: 20px;
  }
}
</style>
