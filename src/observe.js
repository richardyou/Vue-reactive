import { Dep } from './dep'
// 观察者
class Observer {
  constructor(data) {
    this.data = data;
    this.each(this.data)
  }
  each(data) {
    Object.keys(data).forEach(item => this.defineReactive(data, item, data[item]))
  }
  defineReactive(data, key, val) {
    let dep = new Dep;
    Object.defineProperty(data, key, {
      get: function () {
        // 如果存在节点 添加观察者
        if (Dep.target) {
          dep.addSub(Dep.target)
        }
        return val;
      },
      set: function (newVal) {
        // 如果值不一致，更新
        if (Object.is(val, newVal)) return;
        val = newVal;
        dep.notify()
      }
    })
    observe(val)
  }
}

export function observe(data) {
  if (data && typeof data === 'object') {
    new Observer(data)
  }
}