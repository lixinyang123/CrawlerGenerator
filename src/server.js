const http = require("http");
const url = require("url");
const fs = require("fs");
const rotate = require("./rotate");

var server = http.createServer((req,res)=>{
    
    //处理静态文件
    var staticFilePath = __dirname +"/../wwwroot";
    //防止通过路径读取程序外文件
    var requestPath = url.parse(req.url).pathname.replace("..","");
    var realPath = staticFilePath + requestPath;

    //中间件

    //处理请求
    fs.readFile(realPath,(err,data)=>{
        if(err){
            rotate(req,res);
        }
        else{
            res.end(data);
        }
    });

});

server.listen(8435,()=>{
    console.log("Server start at port 8435");
});