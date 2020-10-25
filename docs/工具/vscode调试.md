## VScode 内调试前端代码

需要说明的是，vscode内可以调试很多语言的运行时，它的受欢迎的一方面原因也是由于它支持多种语言的调试功能。vscode内自带node的调试环境，所以无需安装扩展，配置一下就可以直接调试node代码，换言之，如果想要其他环境或其他语言的代码需要装插件。

如果你想要在chrome内调试代码，建议在源码上打上debugger，调试。

**如果想要在vscode内调试前端代码，那么接着往下看**。

通常来说，在前端领域，我们习惯在代码中打上debugger，然后打开chrome调试台进行调试，但是如果我们在看源码的过程中想要调试或者直接调试node代码。

### 两种模式

我们可以在vscode中按F5，或者左边选择调试，点击开始调试来开始调试。开始后，vscode会让你选择你的调试环境，如果没有配置文件会让你先配置。配置中，分为两种模式：

+ launch
+ attach

> In VS Code, there are two core debugging modes, **Launch** and **Attach**, which handle two different workflows and segments of developers. Depending on your workflow, it can be confusing to know what type of configuration is appropriate for your project.
>
> If you come from a browser Developer Tools background, you might not be used to "launching from your tool," since your browser instance is already open. When you open DevTools, you are simply **attaching** DevTools to your open browser tab. On the other hand, if you come from a server or desktop background, it's quite normal to have your editor **launch** your process for you, and your editor automatically attaches its debugger to the newly launched process.
>
> The best way to explain the difference between **launch** and **attach** is to think of a **launch** configuration as a recipe for how to start your app in debug mode **before** VS Code attaches to it, while an **attach** configuration is a recipe for how to connect VS Code's debugger to an app or process that's **already** running.
>
> VS Code debuggers typically support launching a program in debug mode or attaching to an already running program in debug mode. Depending on the request (`attach` or `launch`), different attributes are required, and VS Code's `launch.json` validation and suggestions should help with that.

简单的概括：launch模式是在每次开始调试的时候打开一个浏览器网页，attach模式是先带开了一个浏览器，并且打开远程调试模式，每次调试的时候，其实就是连接浏览器的调试端口。



### launch配置例子

```json
// .vscode/launch.json


{
    "version": "0.1.0",
    "configurations": [
        {
            "name": "Launch localhost",
            "type": "chrome",
            "request": "launch",
            "url": "http://localhost：8080/mypage.html", // 如果本地起了服务，这个就是服务的地址。
            "webRoot": "${workspaceFolder}/wwwroot/" // 当前工作区对应的文件地址。如localhost:8080/foo/app.js.
          																					// 对应的文件就是 /wwwroot/foo/app.js
        },
        {
            "name": "Launch index.html",
            "type": "chrome",
            "request": "launch",
            "file": "${workspaceFolder}/index.html" // 如果是直接访问对应的文件，那么就可以用file这个字段。
        },
    ]
}
```



### attach配置例子

```json
// .vscode/launch.json


{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Attach to Chrome",
            "port": 9222,
            "request": "attach",
            "type": "pwa-chrome",
            "webRoot": "${workspaceFolder}", 
        },
     	 {
            "name": "Attach to Chrome",
            "port": 9222,
            "request": "attach",
            "type": "pwa-chrome",
          	"url": "http://localhost：8080/mypage.html",
            "webRoot": "${workspaceFolder}",
        }
    ]
}
```

首先需要装上debugger-for-chrome扩展：https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome

然后**杀掉所有chrome进程**，按造下面的方法启动带远程调试功能的chrome。

![image-20201025170808540](https://cdn.jsdelivr.net/gh/huntye1/gallery@master/20201025170808.png)



接着启动调试，配置好attach模式的配置。

然后打开浏览器。

