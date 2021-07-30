//路由模块
const url = require("url");
const scriptManager = require("./scriptManager");

module.exports = function (req,res){
    var path = url.parse(req.url).pathname;

    switch(path){
        
        case "/crawler/script":
            var script = JSON.stringify(scriptManager.getScript());
            res.end(script);
            break;

        case "/crawler/operation":
            var query = url.parse(req.url).query;
            if(query == "export"){
                scriptManager.exportScript();
                res.statusCode = 200;
            }
            else if(query == "build"){
                res.statusCode = 200;
            }
            else{
                res.statusCode = 404;
            }
            res.end();
            break;

        case "/crawler/remove":
            var query = url.parse(req.url).query;
            var index = Number.parseInt(query);
            scriptManager.removeSnip(index);
            res.writeHead(302,{
                'Location': '/view/crawler.html'
            });
            res.end();
            break;

        case "/crawler/reset":
            scriptManager.resetScript();
            res.writeHead(302,{
                'Location': '/view/crawler.html'
            });
            res.end();
            break;

        case "/crawler/cycle":
            var query = url.parse(req.url).query;
            var parameters = query.split("&");
            var start = parameters[0].substring(parameters[0].indexOf("=")+1);
            var end = parameters[1].substring(parameters[1].indexOf("=")+1);
            var times = parameters[2].substring(parameters[2].indexOf("=")+1);
            start = Number.parseInt(start);
            end = Number.parseInt(end);
            times = Number.parseInt(times);
            scriptManager.addCycle(start,end,times);

            res.writeHead(302,{
                'Location': '/view/crawler.html'
            });
            res.end();
            break;

        default:
            res.statusCode = 404;
            res.end("这里什么也没有......404");
    }
}