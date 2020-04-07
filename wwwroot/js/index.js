function openurl() {
    var url = document.getElementById("url").value;
    if(url != "" || url!=undefined) {
        if(url.startsWith("http")){
            window.location.href = url;
        }
        else{
            window.location = "http://"+url;
        }
    }
}
function search() {
   var baidukeyword = document.getElementById("baidukeyword").value;
   if(baidukeyword != "") {
    window.location = "https://www.baidu.com/s?ie=UTF-8&wd="+baidukeyword;
   }
}