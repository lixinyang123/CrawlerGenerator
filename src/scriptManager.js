const { dialog } = require('electron');
const fs = require("fs");

//导入CodeSnip
eval(fs.readFileSync("./scripts/codeSnip.js").toString());
var array,win;

function init(browserWindow){
    win = browserWindow;
    array = new Array();
}

function saveScript(){
    win.webContents.executeJavaScript("saveScript()").then((result)=>{
        if(result!=null){
            result.forEach(element => {
                array.push(element);
            });
        }
    });
}

function getScript(){
    return array;
}

function resetScript(){
    array = new Array();
}

function removeSnip(index){
    var newArray = new Array();
    for(var i=0;i<array.length;i++){
        if(i==index){
            continue;
        }
        newArray.push(array[i]);
    }
    array = newArray;
}

function addCycle(start,end,times){
    var newArray = new Array();
    for(var i=0;i<array.length;i++){
        if(i==start){
            newArray.push("for(var i=0;i<"+times+";i++){");
        }
        newArray.push(array[i]);
        if(i==end){
            newArray.push("}");
        }
    }
    array = newArray;
}

async function exportScript(){
    var savePath = dialog.showOpenDialogSync(win,{
        title: "导出路径",
        properties: [
            "openDirectory"
        ]
    })[0];

    dialog.showMessageBox(win,{
        type: "info",
        message: "开始导出[脚本]以及[依赖文件](大约需要5-10秒)，导出完成后会提醒你"
    });

    var content = "";
    array.forEach(element => {
        content += element;
    });
    var fullScript = codeSnip.crawler.replace("@parameter",content);
    
    var rootPath = savePath + "\\MyCrawler";
    rootPath = checkSavePath(rootPath);
    fs.mkdirSync(rootPath);
    
    fs.writeFileSync(rootPath + "\\main.js",fullScript);
    require('cross-zip').unzip("./assets/assets.zip",rootPath,()=>{ 
        dialog.showMessageBoxSync(win,{
            type: "info",
            message: "脚本导出成功"
        });
    });
}

function checkSavePath(rootPath){
    var num = 1;
    var newPath = rootPath;
    while(fs.existsSync(newPath)){
        newPath = rootPath + num.toString();
        num++;
    }
    return newPath;
}

module.exports = {
    init,
    saveScript,
    getScript,
    resetScript,
    exportScript,
    removeSnip,
    addCycle
}