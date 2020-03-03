var codeSnip = {
    crawler : `
        const puppeteer = require('puppeteer');
        const fs = require("fs");
        const request = require("request");
        
        var config = {
            textData : "./Data/TEXT.txt",
            imgDir : "./Data/IMG/"
        };
        
        function init(){
            fs.mkdirSync("./Data");
            fs.mkdirSync(config.imgDir);
        }
        
        function guid() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }
        
        init();

        (async()=>{
            const browser = await puppeteer.launch({
                headless:false,
                defaultViewport:{
                    width:1920,
                    height:1080
                }
            });
        
            var page = (await browser.pages())[0];
        
            @parameter
        
            await browser.close();
        })();
    `,
    goto : `
        await page.goto('@parameter');
        await page.waitFor(7000);
    `,
    getText : `
        var str = await page.$eval("@parameter",ele=>ele.innerText);
        fs.appendFileSync(config.textData,str+String.fromCharCode(10));
    `,
    click : `
        await page.click('@parameter');
        await page.waitFor(7000);
        var pages = await browser.pages();
        page = pages[pages.length-1];
    `,
    downloadImg : `
        var src = await page.$eval("@parameter",ele=>ele.src);
        request(src).pipe(fs.createWriteStream(config.imgDir+guid()+".jpg"));
    `,
    fullScreenshot : `
        await page.screenshot({path: config.imgDir+guid()+".jpg"});
    `,
    screenshot : `
        await (await page.$("@parameter")).screenshot({path: config.imgDir+guid()+".jpg"});
    `,
    typeText : `
        await page.type('@parameter', '@text');
    `
};