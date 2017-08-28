import { observe } from './observe'
import { Compiler } from './compiler'

class MyVue {
  constructor(option) {
    this.data = option.data
    Object.keys(this.data).forEach(key => {
      this.proxy(key)
    })
    observe(this.data)
    new Compiler(option.el,this)
  }
  proxy(key) {
    const self = this;
    Object.defineProperty(self, key, {
      get: function () {
        return self.data[key]
      },
      set: function (newVal) {
        // let val = self.data[key]
        // if (Object.is(val, newVal)) return;
        self.data[key] = newVal;
      }
    })
  }
}

let Vue = new MyVue({
  el:'#root',
  data:{
    name: 'hello Reactive MyVue'
  }
})

window.setTimeout(function () {
  console.log('name值改变');
  console.log(Vue)
  Vue.name = 'name值改变了';
}, 1000);
