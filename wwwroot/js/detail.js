window.onload = setTimeout(()=>{
    $.ajax({
        url: "http://localhost:8435/crawler/script",
        dataType: "text",
        success: function(data) {
            var array = JSON.parse(data);
            var content = "";
            array.forEach(element => {
                content += element;
            });
            var fullScript = codeSnip.crawler.replace("@parameter",content);
            document.getElementById("content").innerText = fullScript;
        },
        error: function(err) {
            console.error(err);
        }
    });
},1000);