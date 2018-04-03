import Dep from './dep'

class Watcher {
  constructor(vm, key, cb) {
    this.vm = vm;
    this.key = key;
    this.cb = cb;
    this.value = this.get()
  }
  update() {
    let curValue = this.vm[this.key]
    let oldValue = this.value
    if (Object.is(curValue, oldValue)) return;
    this.value = curValue
    this.cb.call(this.vm, curValue, oldValue)
  }
  get() {
    Dep.target = this
    // 访问data值，触发obvserve的get,添加Dep观察者
    let value = this.vm[this.key]
    delete Dep.target
    return value
  }
}

export default Watcher