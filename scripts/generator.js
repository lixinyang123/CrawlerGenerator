var script = new Array();

function start(){
    removeEvent();
    var parameter = window.location.href;
    if(confirm("跳转到 "+parameter+" 吗?")){
        script.push(codeSnip.goto.replace("@parameter",parameter));
    }
}

function getText(){
    initEvent(()=>{
        var selector = selectElementWithQuerySelector();
        if(checkText(selector)){
            script.push(codeSnip.getText.replace("@parameter",selector));
            alert("选取成功");
        }
        else{
            alert("此元素无文字内容");
        }
    });
}

function click(){
    initEvent(()=>{
        var selector = selectElementWithQuerySelector();
        if(checkSelector(selector)){
            script.push(codeSnip.click.replace("@parameter",selector));
            alert("选取成功");
        }
        else{
            alert("此元素无法点击");
        }
    });
}

function typeText(){
    initEvent(()=>{
        var selector = selectElementWithQuerySelector();
        if(checkTag(selector,"input")){
            var value = document.querySelector(selector).value;
            script.push(codeSnip.typeText.replace("@parameter",selector).replace("@text",value));
            alert("选取成功");
        }
        else{
            alert("此元素不是图片,请尝试使用元素截图");
        }
    });
}

function downloadImg(){
    initEvent(()=>{
        var selector = selectElementWithQuerySelector();
        if(checkTag(selector,"img")){
            script.push(codeSnip.downloadImg.replace("@parameter",selector));
            alert("选取成功");
        }
        else{
            alert("此元素不是图片,请尝试使用元素截图");
        }
    });
}

function fullScreenshot(){
    warning();
    if(confirm("在此页截屏?")){
        script.push(codeSnip.fullScreenshot);
    }
}

function screenshot(){
    initEvent(()=>{
        var selector = selectElementWithQuerySelector();
        if(checkSelector(selector)){
            script.push(codeSnip.screenshot.replace("@parameter",selector));
            alert("选取成功");
        }
        else{
            alert("此元素无法截图");
        }
    });
}

function saveScript(){
    if(script.length!=0){
        return script;
    }
}

window.addEventListener("contextmenu",(e)=>{
    e.preventDefault();
});