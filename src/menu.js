const scriptManager = require("./scriptManager");

module.exports.getmenuTemplate = (win,shell)=>{

    var menuTemplate = [
        {
            label: "浏览",
            submenu: [
                {
                    label: "主页",
                    click: ()=>{
                        scriptManager.saveScript();
                        win.webContents.loadURL('https://cn.bing.com/');
                    }
                },
                {
                    label: "刷新",
                    click: ()=>{
                        scriptManager.saveScript();
                        win.webContents.reload();
                    }
                },
                {
                    label: "前进",
                    click: ()=>{
                        if(win.webContents.canGoForward()){
                            scriptManager.saveScript();
                            win.webContents.goForward();
                        }
                    }
                },
                {
                    label: "后退",
                    click: ()=>{
                        if(win.webContents.canGoBack()){
                            scriptManager.saveScript();
                            win.webContents.goBack();
                        }
                    }
                }
            ]
        },   
        {
            label: "工具",
            submenu: [
                {
                    label: "开发者工具",
                    click:()=>{
                        win.webContents.openDevTools();
                    }
                },
                {
                    label: "查看当前生成脚本",
                    click:()=>{
                        scriptManager.saveScript();
                        win.webContents.loadURL("http://localhost:8435/view/crawler.html");
                    }
                }
            ]
        },
        {
            label: "选取",
            submenu: [
                {
                    label: "跳转到此页",
                    click:()=>{
                        win.webContents.executeJavaScript("start()");
                    }
                },
                {
                    label: "全屏截图",
                    click:()=>{
                        win.webContents.executeJavaScript("fullScreenshot()");
                    }
                },
                {
                    label: "提取文字",
                    click:()=>{
                        win.webContents.executeJavaScript("getText()");
                    }
                },
                {
                    label: "点击元素",
                    click: ()=>{
                        win.webContents.executeJavaScript("click()");
                    }
                },
                {
                    label: "下载图片",
                    click: ()=>{
                        win.webContents.executeJavaScript("downloadImg()");
                    }
                },
                {
                    label: "选取元素截图",
                    click: ()=>{
                        win.webContents.executeJavaScript("screenshot()");
                    }
                }
            ]
        },
        {
            label: '关于',
            role: 'help',
            submenu: [
                {
                    label: '访问官网',
                    click: ()=>{
                        scriptManager.saveScript();
                        win.webContents.loadURL('https://www.lllxy.net');
                    }
                },
                {
                    label: '反馈中心',
                    click: ()=>{
                        scriptManager.saveScript();
                        win.webContents.loadURL('https://www.lllxy.net/feedback/');
                    }
                }
            ]
        }
    ]

    return menuTemplate;
}