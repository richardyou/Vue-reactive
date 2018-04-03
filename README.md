# vue-reactive

> ### 在线预览代码 : https://stackblitz.com/edit/vue-reactive

代码结构很简单，主要分为四个部分

* Observer 发布者 负责监听 data 属性，添加数据拦截 通知 Dep

* Dep 负责 Obserber Watcher 通信 触发 Watcher 的 update

* Watcher 接受 Dep 变更通知 执行 Compiler 更新回调

* Compiler 负责 view 解析 添加 watcher 负责 view 反向更新 model 层

![vue_reactive](Vue_reactive.png)
