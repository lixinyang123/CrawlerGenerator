var obj = null;

//=======================================ElementHighLight=================================================
function hightLight(){
    obj = event.srcElement;
    obj.style.border = "2px solid red";
}

function reset(){
    obj.style.border = "none";
    obj = null;
}

//===================================Generate crawler script With Js=======================================

function selectElementWithJs(){
    var statement = "";

    //id不空，按id查询
    if(obj.id!=""){
        var id = obj.id;
        statement = "document.getElementById('"+id+"')";
    }
    else if(obj.className!=""){

        var classIndex = null;
        var objs = document.getElementsByClassName(obj.className);

        for(var i=0;i<objs.length;i++){
            if(objs[i].isEqualNode(obj)){
                classIndex = i;
            }
        }

        statement = "document.getElementsByClassName('"+obj.className+"')["+classIndex+"]";
    }
    else{
        var tagIndex = null;
        var objs = document.getElementsByTagName(obj.tagName);
        for(var i=0;i<objs.length;i++){
            if(objs[i].isEqualNode(obj)){
                tagIndex = i;
            }
        }

        statement = "document.getElementsByTagName('"+obj.tagName+"')["+tagIndex+"]";
    }
    return statement;
}


//================================Generate crawler script With QuerySelector===============================

function selectElementWithQuerySelector(){
    var array = new Array();
    
    var element = obj;
    
    while(element.parentElement!=undefined){
        if(element.id!=""){
            array.push("#"+element.id);
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

    return statement;
}

function initEvent(selectCallback){

    removeEvent();
    warning();

    document.onmouseover = hightLight;
    document.onmouseout = reset;
    document.oncontextmenu = ()=>{
        obj.style.border = "none";
        selectCallback();
        if(!confirm("继续选取?")){
            removeEvent();
        }
    }
}

function warning(){
    if(script.length==0){
        alert("此处为新页面，且之前并没有任何操作，请确保[选取]之前有[点击]或[跳转]操作");
    }
}

function removeEvent(){
    document.onmouseover = null;
    document.onmouseout = null;
    document.oncontextmenu = null;
}
