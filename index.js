const http=require('http');
const fs=require('fs');
var requests=require("requests")
const homeFile=fs.readFileSync("home.html","utf-8");
var qs = require('querystring');
const replaceVal=(tempVal,orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}",(orgVal.main.temp-273).toPrecision(2));    
     temperature=temperature.replace("{%minTemp}",(orgVal.main.temp_min-273).toPrecision(2));    
     temperature=temperature.replace("{%maxTemp%}",(orgVal.main.temp_max-273).toPrecision(2));    
     temperature=temperature.replace("{%location%}",orgVal.name);    
     temperature=temperature.replace("{%country%}",orgVal.sys.country); 
     return temperature;   
}

const server=http.createServer((req,res)=>{
  if(req.url=='/'){
      console.log("Test1");
      var body='';
      req.on('data', chunk => {
        //console.log('A chunk of data has arrived: ', chunk);
        body+=chunk;
      });
      req.on('end', () => {
        //console.log('No more data');
        var post={};
        post.city="delhi";
        var p=qs.parse(body);
        if(p.city==undefined) p.city=post.city;
        console.log(post);    
        requests('http://api.openweathermap.org/data/2.5/weather?q='+p.city+'&appid=74df725f8dd1700665a70ec9e602daeb')
        .on('data', (chunk)=>{
            const objData=JSON.parse(chunk);
            const arrd=[objData];
            const realTimeData=arrd.map(val=>replaceVal(homeFile,val)).join("");
            res.write(realTimeData);
        })
        .on('end', function (err) {
          if (err) return console.log('connection closed due to errors', err);
          res.end();
        });
      })
      
  }
     
});
server.listen(80,"127.0.0.1");
