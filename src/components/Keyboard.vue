<template>
  <div class="ui-keyborad" @touchstart='onKeydown($event)' @touchend='onKeyup($event)' @mousedown='onKeydown($event)' @mouseup='onKeyup($event)'>
    <dl class="row">
      <dd :data-code="keyCodeList[0]">
        {{keyCodeList[0]}}
      </dd>
      <dd :data-code="keyCodeList[1]">
        {{keyCodeList[1]}}
      </dd>
      <dd :data-code="keyCodeList[2]">
        {{keyCodeList[2]}}
      </dd>
    </dl>
    <dl class="row">
      <dd :data-code="keyCodeList[3]">
        {{keyCodeList[3]}}
      </dd>
      <dd :data-code="keyCodeList[4]">
        {{keyCodeList[4]}}
      </dd>
      <dd :data-code="keyCodeList[5]">
        {{keyCodeList[5]}}
      </dd>
    </dl>
    <dl class="row">
      <dd :data-code="keyCodeList[6]">
        {{keyCodeList[6]}}
      </dd>
      <dd :data-code="keyCodeList[7]">
        {{keyCodeList[7]}}
      </dd>
      <dd :data-code="keyCodeList[8]">
        {{keyCodeList[8]}}
      </dd>
    </dl>
    <dl class="row">
      <dd v-if=" type === 'number' " data-code="" style="background-color: #cbd0d5;cursor: auto;">
        &nbsp;
      </dd>
      <dd v-else :data-code="keyCodeList[10]">
        {{keyCodeList[10]}}
      </dd>
      <dd :data-code="keyCodeList[9]">
        {{keyCodeList[9]}}
      </dd>
      <dd class="del" data-code="delete">
        <i class="del"></i>
      </dd>
    </dl>
  </div>

</template>

<script>
export default {
  name: 'UIKeyboard',
  props: {
    // 输出的字符对象
    value: {
      type: Object,
      default: {}
    },
    // 键盘类型 number identity
    type: {
      type: String,
      default: 'number'
    },
    // 是否是随机键盘
    isRandom: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      // 键盘按键List: []
      keyCodeList: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
    };
  },
  created: function() {
    this.type === 'identity' ? this.keyCodeList.push('x') : '';
    this.isRandom ? this.randomKeyborad() : '';
  },
  methods: {
    /**
     * 处理虚拟键盘按下事件.
     */
    onKeydown: function(event) {
      var el = event.target;
      el.tagName.toLowerCase() === 'i' ? (el = el.parentNode) : '';
      var scode = el.dataset.code;
      el.className = 'active';
      if (scode === '') return;
      //发布键盘按下消息
      this.$emit('ui.keyboard.onkeydown', {
        key: scode,
        timestamp: +new Date()
      });
      //添加这句话是为了修复uc bug
      event.preventDefault();
    },
    /**
     * 处理虚拟键盘抬起事件.
     */
    onKeyup: function(event) {
      var el = event.target;
      el.tagName.toLowerCase() === 'i' ? (el = el.parentNode) : '';
      var scode = el.dataset.code;
      el.className = '';
      if (scode === '') return;
      var code = {
        key: scode,
        timestamp: +new Date()
      };
      //发布键盘抬起消息
      this.$emit('ui.keyboard.onkeyup', {
        key: scode,
        timestamp: +new Date()
      });
      this.$emit('input', code);
    },
    /**
     * 洗牌算法生成随机键盘.
     */
    randomKeyborad: function() {
      var length = this.keyCodeList.length;
      for (var i = 0; i < length; i++) {
        var from = i,
          fromValue = this.keyCodeList[from],
          to = Math.floor(Math.random() * length) % length,
          toValue = this.keyCodeList[to];
        this.keyCodeList[from] = toValue;
        this.keyCodeList[to] = fromValue;
      }
    },
    /**
     * 清空键盘输入.
     */
    clear: function() {
      this.codeList.length = 0;
    }
  }
};
</script>

<style lang="scss">
.ui-keyborad {
  user-select: none;
  text-align: center;
  background-color: #fff;
  vertical-align: middle;
  .row {
    display: flex;
    font-size: 18px;
    align-items: center;
    dd {
      flex: 1;
      border-right: 1px solid #ddd;
      border-top: 1px solid #ddd;
      height: 40px;
      line-height: 40px;
      box-sizing: border-box;
      cursor: pointer;
      .del {
        visibility: visible;
        position: relative;
        display: inline-block;
        vertical-align: middle;
        width: 16px;
        height: 14px;
        line-height: 14px;
        border-radius: 3px;
        background-color: #000000;
      }
      .del::before {
        content: "";
        display: block;
        width: 0;
        height: 0;
        border-right: 7px solid #000000;
        border-bottom: 7px solid transparent;
        border-top: 7px solid transparent;
        transform: translateX(-5px) translateY(0);
      }
      .del::after {
        content: "x";
        font-size: 10px;
        font-weight: bold;
        color: #d1cccd;
        display: block;
        height: 14px;
        line-height: 14px;
        transform: translateX(0px) translateY(-14px);
      }
    }
    .active {
      background-color: #cbd0d5;
      i {
        // visibility: hidden;
      }
    }
    dd:last-child {
      border-right: 0;
    }
  }
  .row:last-child {
    dd {
      border-bottom: 1px solid #ddd;
    }
    // dd:first-child {
    //   background-color: #cbd0d5;
    // }
    dd:last-child {
      background-color: #cbd0d5;
    }
    .inactive {
      background-color: #fff !important;
      i {
        visibility: hidden;
      }
    }
  }
}
</style>
