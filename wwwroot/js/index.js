function openurl() {
    var url = document.getElementById("url").value;
    if(url != "") {
        window.location = "https://"+url;
    }
}
function search() {
   var baidukeyword = document.getElementById("baidukeyword").value;
   if(baidukeyword != "") {
    window.location = "https://www.baidu.com/s?ie=UTF-8&wd="+baidukeyword;
   }
}