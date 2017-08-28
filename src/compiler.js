import { Watcher } from './watcher'

export class Compiler {
  constructor(el,vm) {
    this.el = document.querySelector(el)
    this.vm = vm
    this.init()
  }
  init(){
    if(this.el){
      this.fragment = this.nodeToFragment(this.el)
      this.compileElement(this.fragment)
      this.el.appendChild(this.fragment)
    }else{
      console.warn('el element not exist')
    }
  }
  compileElement(el){
    Array.from(el.childNodes).forEach(node => {
      let reg = new RegExp('\{\{(.*)\}\}')
      let text = node.textContent
      if(this.isElementNode(node)){
        this.compile(node)
      }
      if(this.isTextNode && reg.test(text)){
        this.compileText(node,reg.exec(text)[1])
      }
      if(node.hasChildNodes){
        this.compileElement(node)
      }
    })
  }
  compileText(node,key){
    let text = this.vm[key]
    if(text){
      node.textContent = text
      new Watcher(this.vm,key,(newVal) => {
        node.textContent = newVal
      })
    }
  }
  compile(node){
    const nodeAttr = node.attributes
    Array.from(nodeAttr).forEach(attr => {
      let attrName = attr.name
      if(this.isDirective){
        let exp = attr.value
        let dir = attrName.substring(2)    
        if(this.isEventDirective(dir)){
          // v-on:event
          this.compileElement(node,exp,dir)
        }else{
          // v-model
          this.compileModel(node,exp,dir)
        }
        node.removeAttribute(attrName)
      }
    })
  }
  compileEvent(node,exp,dir){
    let eventType = dir.substring(1)
    let eventHandler = this.vm.methods && this.vm.methods[exp]
    if(eventType && eventHandler){
      node.addEventListener(eventType,eventHandler.bind(this.vm),false)
    }
  }
  compileModel(node,exp,dir){
    let val = this.vm[exp]
    node.value = val
    new Watcher(this.vm,exp,(value) => {
      node.value = value
    })
    node.addEventListener('input',(e) => {
      console.log(e)
      let newVal = e.target.value
      if(val === newVal) return
      val = newVal
      this.vm[exp] = newVal
    })
  }
  nodeToFragment(el) {
    let fragment = document.createDocumentFragment()
    let child = el.firstChild
    while (child) {
      fragment.appendChild(child)
      child = el.firstChild
    }
    return fragment
  }
  isTextNode(node){
    return node.nodeType === 3
  }
  isElementNode(node){
    return node.nodeType === 1
  }
  isDirective(attr){
    return attr.startsWith('v-')
  }
  isEventDirective(dir){
    return dir.startsWith('on:')
  }
}
