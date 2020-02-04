function init(){
    $.ajax({
        url: "http://localhost:8435/crawler/script",
        dataType: "text",
        success: function(data) {
            showData(JSON.parse(data));
        },
        error: function(err) {
            console.error(err);
        }
    });
}

function showData(array){
    for(var i=0;i<array.length;i++){
        var tr = document.createElement("tr");
        var td = document.createElement("td");
        td.innerText = array[i];
        tr.appendChild(td);
        tr.appendChild(createRemoveBtn(i));
        tr.setAttribute("onclick","selectSnip("+i+")");
        document.getElementById("content").appendChild(tr);
    }
}

function selectSnip(index){

    var trs = document.querySelectorAll("tr");

    var firstIndex = null;
    for(var i=0;i<trs.length;i++){
        if(trs[i].getAttribute("checked")!=null){
            firstIndex = i;
        }
    }
    
    if(firstIndex!=null && firstIndex>index){
        for(var i=index+1;i<=firstIndex;i++){
            changeState(trs[i],true);
        }
    }

    if(firstIndex!=null && firstIndex<index){
        for(var i=firstIndex;i<=index-1;i++){
            changeState(trs[i],true);
        }
    }

    var tr = trs[index];
    if(tr.getAttribute("checked")==null){
        changeState(tr,true);
    }
    else{
        changeState(tr,false);
    }
}

function changeState(tr,flag){
    if(flag){
        tr.style.backgroundColor = "gray";
        tr.setAttribute("checked","checked");
    }
    else{
        tr.style.backgroundColor = "white";
        tr.removeAttribute("checked");
    }
}

function createRemoveBtn(index){
    var td = document.createElement("td");
    var link = document.createElement("a");
    link.innerText = "Remove";
    link.href = "http://localhost:8435/crawler/remove?"+index;
    td.appendChild(link);
    return td;
}

function checkCycle(){
    var list = document.querySelectorAll("tr");

    var flag = false;
    for(var i=list.length-1;i>=0;i--){
        if(list[i].getAttribute("checked")!=null){
            flag = true;
            break;
        }
    }

    //判断是否选择
    if(flag){
        document.getElementById("btn_cycle").setAttribute("data-target",".inputCycle");
    }
    else{
        document.getElementById("btn_cycle").setAttribute("data-target",".emptySelect");
    }
}

function addCycle(){

    var list = document.querySelectorAll("tr");

    //获取起始索引
    var start = null;
    for(var i=0;i<list.length;i++){
        if(list[i].getAttribute("checked")!=null){
            start = i;
            break;
        }
    }

    //获取结束索引
    var end = null;
    for(var i=list.length-1;i>=0;i--){
        if(list[i].getAttribute("checked")!=null){
            end = i;
            break;
        }
    }

    var times = document.getElementById("cycleTimes").value;

    if(times!=0 && times!=undefined && times!=null){
        var parameter = "start="+start+"&end="+end+"&times="+times;
        var url = "http://localhost:8435/crawler/cycle?"+parameter;
        window.location.href = url;
    }
    else{
        alert("输入内容不合法");
    }
}

function exportScript(){
    $.ajax({
        url: "http://localhost:8435/crawler/operation?export",
        dataType: "text",
        success: function(data) {
            console.log(data);
        },
        error: function(err) {
            console.error(err);
        }
    });
}