const { app, BrowserWindow , Menu, shell } = require('electron');
const fs = require("fs");
const menuTemplate = require("./menu");
const scriptManager = require("./scriptManager");
require("./server");

var win,script;

function createWindow () {
  win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      nodeIntegration: false
    }
  });

  initMenu();
  scriptManager.init(win);
  win.loadURL('http://localhost:8435/view/index.html');

  //win.webContents.openDevTools();

  win.webContents.on('new-window',(event, url, frameName, disposition, options)=>{
    scriptManager.saveScript();
    win.loadURL(url);
    event.preventDefault();
  });

  //dom加载完成注入选取器脚本（未初始化）
  win.webContents.on('dom-ready',()=>{
    win.webContents.executeJavaScript(script);
  });

  win.webContents.on("will-navigate",()=>{
    scriptManager.saveScript();
  });

  win.on('closed', () => {
    win = null
  });
}

//初始化顶部菜单
//初始化菜单需要BrowserWindow对象，需要在initApp之后
function initMenu(){
  var template = menuTemplate.getmenuTemplate(win,shell);
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function initApp(){

  app.on('ready', async()=>{
    
    script = "";
    script += fs.readFileSync("./scripts/selector.js").toString();
    script += fs.readFileSync("./scripts/codeSnip.js").toString();
    script += fs.readFileSync("./scripts/generator.js").toString();
    script += fs.readFileSync("./scripts/inspector.js").toString();

    createWindow();
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });
  
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
}

initApp();