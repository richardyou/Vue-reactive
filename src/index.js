import Vue from './vue';

let vm = new Vue({
	el: '#root',
	data: {
		name: 'hello Reactive MyVue',
		count: 1,
	},
	methods: {
		add() {
			this.count++;
			console.log(this.count);
		},
	},
});

window.setTimeout(function() {
	// console.log('name值改变', Vue);
	vm.name = 'name值改变了';
}, 1000);
