const http=require('http');
const fs=require('fs');
var requests=require("requests")
const homeFile=fs.readFileSync("home.html","utf-8");

const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",orgVal.main.temp);    
     temperature=temperature.replace("{%minTemp}",orgVal.main.temp_min);    
     temperature=temperature.replace("{%maxTemp%}",orgVal.main.temp_max);    
     temperature=temperature.replace("{%location%}",orgVal.name);    
     temperature=temperature.replace("{%country%}",orgVal.sys.country); 
     return temperature;   
}

const server=http.createServer((req,res)=>{
     if(req.url=='/'){
        requests('http://api.openweathermap.org/data/2.5/weather?q=Vrindavan&appid=74df725f8dd1700665a70ec9e602daeb')
        .on('data', (chunk)=>{
            const objData=JSON.parse(chunk);
            const arrd=[objData];
            const realTimeData=arrd.map(val=>replaceVal(homeFile,val)).join("");
            // console.log(objData.main);
            // console.log(realTimeData);
            res.write(realTimeData);
        })
        .on('end', function (err) {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
        });
     }
});
server.listen(8000,"127.0.0.1");