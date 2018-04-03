import Dep from './dep'

class Observer {
  constructor(data) {
    this.data = data;
    this.each(this.data)
  }
  each(data) {
    Object.keys(data).forEach(item => this.defineReactive(data, item, data[item]))
  }
  defineReactive(data, key, val) {
    let dep = new Dep()
    Object.defineProperty(data, key, {
      get: () => {
        // 如果存在节点 添加订阅者
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val;
      },
      set: (newVal) => {
        // 如果值不一致，触发dep的update
        if (Object.is(val, newVal)) return;
        val = newVal;
        dep.notify()
      }
    })
  }
}

function observe(data) {
  if (data && typeof data === 'object') {
    new Observer(data)
  }
}

export default observe