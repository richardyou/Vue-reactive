class Dep {
  constructor() {
    this.subs = []
  }
  addSub(item) {
    this.subs.push(item)
  }
  notify() {
    this.subs.forEach(item => item.update())
  }
}

Dep.target = null

export default Dep