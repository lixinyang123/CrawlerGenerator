function checkSelector(selector){
    try {
        var ele = document.querySelector(selector);
        if(ele!=undefined){
            return true;
        }
        return false;

    } catch (error) {
        return false;
    }
}

function checkText(selector){

    if(checkSelector(selector)){
        var text = document.querySelector(selector).innerText
        if(text!="" && text!=undefined && text!=null){
            return true;
        }
    }
    return false;
}

function checkImage(selector){
    
    if(checkSelector(selector)){
        var tagName = document.querySelector(selector).tagName.toLowerCase();
        if(tagName=="img"){
            return true;
        }
    }
    return false;
}