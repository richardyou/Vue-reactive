import Watcher from './watcher';

class Compiler {
	constructor(el, vm) {
		this.el = document.querySelector(el);
		this.vm = vm;
		this.init();
	}
	init() {
		if (this.el) {
			this.fragment = this.nodeToFragment(this.el);
			this.compileElement(this.fragment);
			this.el.appendChild(this.fragment);
		} else {
			console.error('el element not exist');
		}
	}
	compileElement(el) {
		Array.from(el.childNodes).forEach(node => {
			let reg = new RegExp('{{(.*)}}');
			let text = node.textContent;
			if (this.isElementNode(node)) {
				this.compile(node);
			}
			if (this.isTextNode(node) && reg.test(text)) {
				this.compileText(node, reg.exec(text)[1]);
			}
			if (node.hasChildNodes) {
				this.compileElement(node);
			}
		});
	}
	compileText(node, key) {
		let text = this.vm[key];
		if (text) {
			node.textContent = text;
			new Watcher(this.vm, key, newVal => {
				node.textContent = newVal;
			});
		}
	}
	compile(node) {
		const nodeAttr = node.attributes;
		Array.from(nodeAttr).forEach(attr => {
			let attrName = attr.name;
			if (this.isDirective(attrName)) {
				let exp = attr.value;
				let dir = attrName.substring(2);
				if (this.isEventDirective(dir)) {
					// v-on:event
					this.compileEvent(node, exp, dir);
				} else {
					// v-model
					this.compileModel(node, exp, dir);
				}
				node.removeAttribute(attrName);
			}
		});
	}
	compileEvent(node, exp, dir) {
		let eventType = dir.split(':')[1];
		let eventHandler = this.vm.methods && this.vm.methods[exp];
		if (eventType && eventHandler) {
			node.addEventListener(eventType, eventHandler.bind(this.vm), false);
		}
	}
	compileModel(node, exp, dir) {
		let val = this.vm[exp];
		node.value = val;
		new Watcher(this.vm, exp, value => {
			node.value = value;
		});
		node.addEventListener('input', e => {
			let newVal = e.target.value;
			if (val === newVal) return;
			val = newVal;
			this.vm[exp] = newVal;
		});
	}
	nodeToFragment(el) {
		let fragment = document.createDocumentFragment();
		let child;
		// eslint-disable-next-line
		while ((child = el.firstChild)) {
			fragment.appendChild(child);
		}
		return fragment;
	}
	isTextNode(node) {
		return node.nodeType === 3;
	}
	isElementNode(node) {
		return node.nodeType === 1;
	}
	isDirective(attr) {
		return attr.startsWith('v-');
	}
	isEventDirective(dir) {
		return dir.startsWith('on:');
	}
}

export default Compiler;
