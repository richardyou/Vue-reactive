import observe from './observe'
import Compiler from './compiler'

class Vue {
  constructor(option) {
    this.data = option.data
    this.methods = option.methods
    Object.keys(this.data).forEach(key => {
      this.proxy(key)
    })
    observe(this.data)
    new Compiler(option.el, this)
  }
  proxy(key) {
    Object.defineProperty(this, key, {
      get: () => {
        return this.data[key]
      },
      set: (newVal) => {
        let val = this.data[key]
        if (Object.is(val, newVal)) return;
        this.data[key] = newVal;
      }
    })
  }
}

export default Vue