# CrawlerGenerator

自动生成puppyteer爬虫脚本

## jsdom

因为我不喜欢Python（现在感觉Python还挺香的😂），而且js操作dom效率应该更高一点吧。。。。毕竟爬自己人。。。所以我最开始选择用nodejs来写爬虫，有一个包叫 [jsdom](https://github.com/jsdom/jsdom "jsdom") 挺好用的。请求网页，然后丢jsdom里面就可以使用它来获取网页上的元素。

```javascript
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
console.log(dom.window.document.querySelector("p").textContent);
```

简单易用

不过遇到一些渐进式的网页，或者spa就比较剌蛋了。。。会比较麻烦，所以 [Puppeteer](https://github.com/puppeteer/puppeteer "Puppeteer") 就是一个很好的选择。

## 什么是Puppeteer?

Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。Puppeteer 默认以 headless 模式运行，但是可以通过修改配置文件运行“有头”模式。

![](https://corehome.oss-cn-shenzhen.aliyuncs.com/blogs/puppeteer.png)

#### 你可以使用Puppeteer做什么？
- 生成页面 PDF。
- 抓取 SPA（单页应用）并生成预渲染内容（即“SSR”（服务器端渲染））。
- 自动提交表单，进行 UI 测试，键盘输入等。
- 创建一个时时更新的自动化测试环境。 使用最新的 JavaScript 和浏览器功能直接在最新版本的Chrome中执行测试。
- 捕获网站的 timeline trace，用来帮助分析性能问题。
- 测试浏览器扩展。

#### Puppeteer简单使用

在项目中使用 Puppeteer：
> npm i puppeteer

注意：puppeteer-core 只包含无头 Chrome API 不会下载 Chromium，如果你的电脑上有Chromium可以直接执行：
> npm i puppeteer-core

创建main.js
> Puppeteer 至少需要 Node v6.4.0

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://www.lllxy.net');
  await page.screenshot({path: 'example.png'});

  await browser.close();
})();
```

接下来在命令行中执行

> node main.js

Puppeteer 初始化的屏幕大小默认为 800px * 600px。但是这个尺寸可以通过 [Page.setViewport()](https://github.com/GoogleChrome/puppeteer/blob/v1.10.0/docs/api.md#pagesetviewportviewport "Page.setViewport()") 设置。

接下来你就会得到一张网页截图。

## 爬虫生成器

上述两种方式写爬虫都不错，看情况选择就好了，但是。。。。由于我比较懒，每次都要自己写就感觉很不爽，如果说可以不需要自己写，点点鼠标就可以生成脚本在网页上做一些自动化工作，那样岂不是很爽。所以想法就产生了，来看[Puppeteer文档](https://zhaoqize.github.io/puppeteer-api-zh_CN/ "Puppeteer文档")。

先看[选择器部分](https://zhaoqize.github.io/puppeteer-api-zh_CN/#?product=Puppeteer&version=v3.0.2&show=api-pageselector "选择器部分")

![](https://lllxy.oss-cn-shenzhen.aliyuncs.com/CoreHome/Blogs/批注 2020-05-06 225320.jpg)

-  **page.$(selector)**
此方法在页面内执行 document.querySelector。如果没有元素匹配指定选择器，返回值是 null。

- **page.$$(selector)**
此方法在页面内执行 document.querySelectorAll。如果没有元素匹配指定选择器，返回值是 [ ]。

看到这有没有想到点什么？只要有了 QuerySelector 就可以实现 选取/点击/截图/下载/提取属性 等等Puppeteer的任何功能。所以只需要实现点击鼠标生成 QuerySelector 的功能，其余的无非就是把 queryselector 套到各种操作的模板里面就行了。

下面就是最核心的部分，生成 QuerySelector

## 生成 QuerySelector

如果你还不知道QuerySelector，看[文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Document/querySelector "文档")去。

首先要获取鼠标指到的元素，给指到的元素加个红色边框把。。。。

```javascript
document.onmouseover = () => {
    obj = event.srcElement;
    obj.style.border = "2px solid red";
}
```

随便打开个网页晃晃鼠标试试。。。

![](https://corehome.oss-cn-shenzhen.aliyuncs.com/blogs/批注 2020-05-07 193017.jpg)

这样肯定不行，所以要加上鼠标移出元素清除边框

```javascript
var obj = null;

function hightLight(){
    obj = event.srcElement;
    obj.style.border = "2px solid red";
}

function reset(){
    obj.style.border = "none";
    obj = null;
}

document.onmouseover = hightLight;
document.onmouseout = reset;
```

现在应该是指谁谁红，然后鼠标移出后清除红色边框

下来就是生成 QuerySelector ，生成的时候肯定要有一个优先级，如果元素有id，那么可以直接用id查找，如果没有id可以考虑用class，如果没有class那就只能考虑用TagName查找，当然TagName是万能的，可以只用TagName加上此元素在所有此TagName数组中的索引来定位元素，但是。。。经常定位不准确，比如网页少加载了点什么东西，你就无法定位到你想要的元素了。所以，还用第一个方案。

说一下思路，创建一个数组，如果此元素有id，直接把 **#id** push到数组。如果没有id则判断父元素中有几个相同TagName的元素，如果只有一个，直接保存 **tagname** 。如果不止一个相同TagName的元素则判断父元素中有几个相同class的元素，只有一个直接存 **.classname** , 如果存在很多个相同class的元素 或者 元素压根没有class，那么就按TagName,父元素来个循环，判断第几个才是此元素接下来保存 **element.tagName+":nth-child("+tagIndex+")"** 接下来将父元素设为当前元素，依次往上一级查找，直到查找到有id存在的父元素，停止循环，如果父元素一直没有id，那就会按tagname一直查到body那一级，接下来反转数组，你就会得到一个完整的QuerySelector选择器 。下面直接上代码。

```javascript
var obj = null;

function hightLight(){
    obj = event.srcElement;
    obj.style.border = "2px solid red";
}

function reset(){
    obj.style.border = "none";
    obj = null;
}

function selectElementWithQuerySelector(){
    var array = new Array();
    
    var element = obj;
    
    while(element.parentElement!=undefined){
        if(element.id!=""){
            array.push("#"+element.id);
            //array.push("[id='"+element.id+"']");
            break;
        }
        else{
            if(element.parentElement.children.length==1){
                array.push(element.tagName);
            }
            else{
                var tagLength = element.parentElement.getElementsByTagName(element.tagName).length;
                if(tagLength==1){
                    array.push(element.tagName);
                }
                else{
                    var fullClassName = "";
                    element.classList.forEach(cName => {
                        fullClassName += "."+cName;
                    });
                    
                    if(element.parentElement.querySelectorAll(element.tagName+fullClassName).length==1){
                        array.push(element.tagName+fullClassName);
                    }
                    else{
                        var children = element.parentElement.children;
                        var tagIndex = 0;
                        for(var i=0;i<children.length;i++){
                            if(children[i].isEqualNode(element)){
                                tagIndex = ++i;
                            }
                        }

                        array.push(element.tagName+":nth-child("+tagIndex+")");
                    }
                }

            }
        }
        element = element.parentElement;
    }
    
    var statement = "";

    array = array.reverse();

    for(var i=0;i<array.length;i++){
        statement += array[i]+">";
    }
    statement = statement.substring(0,statement.length-1);

    console.log(statement);
}


document.onmouseover = hightLight;
document.onmouseout = reset;
document.oncontextmenu = selectElementWithQuerySelector;
```

接下来在元素上点击鼠标右键，控制台就会输出 QuerySelector 

## 生成Puppeteer脚本

QuerySelector有了，接下来只需要和Puppeteer的特定操作的模板相结合，之后拼接到一起就可以实现生成爬虫。

放几个操作的模板（简化了，实际肯定没这么简单。。。而且不止这几个，还有跳转啊，全屏截图什么的，一大堆。。。我就放几个打个比方）
```javascript
//获取文本
var str = await page.$eval("@parameter",ele=>ele.innerText);

//点击元素
await page.click("@parameter");

//获取图片链接
var src = await page.$eval("@parameter",ele=>ele.src);

//获取元素截图
await (await page.$("@parameter")).screenshot({path: "screenshot.jpg"});

//输入文本
await page.type("@parameter", "@text");
```
将生成的 QuerySelector 和模板中的 parameter 进行替换并且相互组合，当然你还需要一个最基本的代码片段，创建puppeteer。。。然后把生成的内容组装，接下来导出即可。

#### 为什么选择Electron？

使用Electron主要原因是Puppeteer用的是Chromium浏览器，生成爬虫时使用的浏览器尽量也用Chromium，避免不同浏览器导致元素选取出问题。

#### 怎么将脚本注入浏览器？如何将不同网页生成的脚本都保存起来？

目前有两种解决方案
- 客户端带一个服务器
点击生成脚本的时候，向这个服务器发请求，然后暂存起来（当然你在不同的网页给localhost发请求，肯定涉及跨域问题，所以要处理这个问题）
- Electron和JS交互（具体可以看[Electron文档](http://www.electronjs.org/docs/api/web-contents#contentsexecutejavascriptcode-usergesture "文档")，这里直接放代码）

```javascript
webContents.executeJavaScript("saveScript()").then((result)=>{
	console.log(result);
});
```

当然使用这种方法，你需要写一个SaveScript方法,返回当前页面生成的脚本，而且每当页面要刷新时，也要调用此方法。

接下来将生成的所有脚本组合到一起，导出即可。

## 导出脚本怎么使用

给用户导出脚本，没有Puppeteer的依赖，用户依旧不能运行，但是带上项目依赖的话导出一个Chromium浏览器又太大了，目前采用的方式是在服务器跑chrome，然后脚本都在服务器上运行，给用户的脚本只包含了puppeteer-core，至于怎么在服务器跑chrome来供puppeteer来使用，可以了解一下 [browserless](https://github.com/browserless/chrome "这个") 。

当然我自己用的时候肯定没有这样干，不过我测试了一下，这样子完全可行，而且给用户生成的脚本体积较小。

## 最后

如果你对这个小破软件感兴趣，可以 [点击这里](https://github.com/lixinyang123/CrawlerGenerator "了解一下") 了解一下，当然现在还是早期版本。。。。比较劣质
