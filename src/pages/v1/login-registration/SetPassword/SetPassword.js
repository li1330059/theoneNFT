import Vue from 'vue'
import SetPassword from './SetPassword.vue'

const Box = Vue.extend(SetPassword)

SetPassword.install = function (data) {
    
  let instance = new Box({
    data
  }).$mount()
  document.body.appendChild(instance.$el)
  Vue.nextTick(() => {
    instance.show = true
    // show 和弹窗组件里的show对应，用于控制显隐
  })
}

export default SetPassword