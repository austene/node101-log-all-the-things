const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');


app.use((req, res, next) => {
// write your logging code here 
    var userAgent = req.headers['user-agent'];
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.url;
    var version = 'HTTP/' + req.httpVersion; 
    var status = res.statusCode;
    var loglineData = `\"${userAgent}\",\"${time}\",\"${method}\",\"${resource}\",\"${version}\",\"${status}\"`; 

    console.log(__dirname);
    fs.appendFile(path.join(__dirname, 'log.csv'), loglineData + '\n', (err) => {
        if (err) throw err;
        console.log('wrote to log.csv');
    });
    next();
});


app.get('/', (req, res) => {
// write your code to respond "ok" here
    res.send('ok');
    res.status('200');
    return;
});

function csvJSON(csv){  //var csv is the CSV file with headers
    console.log('csv = ' + csv);
    var lines=csv.split("\n");
    console.log(lines[0]);
    console.log(lines[1]);
    var result = [];
    var headers=lines[0].split(",");
    console.log(headers);
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline=lines[i].splitCSV();
        if (currentline.length < headers.length) {
            continue;
        }
        console.log('currentline = ' + currentline);
        console.log('currentline.length =' + currentline.length);
        console.log('headers.length =' + headers.length);
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    console.log('csvJSON = ' + JSON.stringify(result));
    return result; //JavaScript object
    
};

String.prototype.splitCSV = function(sep) {
    for (var foo = this.split(sep = sep || ","), x = foo.length - 1, tl; x >= 0; x--) {
      if (foo[x].replace(/"\s+$/, '"').charAt(foo[x].length - 1) == '"') {
        if ((tl = foo[x].replace(/^\s+"/, '"')).length > 1 && tl.charAt(0) == '"') {
          foo[x] = foo[x].replace(/^\s*"|"\s*$/g, '').replace(/""/g, '"');
        } else if (x) {
          foo.splice(x - 1, 2, [foo[x - 1], foo[x]].join(sep));
        } else foo = foo.shift().split(sep).concat(foo);
      } else foo[x].replace(/""/g, '"');
    } 
    console.log('splitCSV = ' + foo);
    console.log('splitCSV[3]' + foo[3]);
    var a = ['a', 'b', 'c', 'd'];
    console.log(a);
    return foo;
};

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    var csvLog = path.join(__dirname, 'log.csv');
    var csvData = fs.readFileSync(csvLog, 'utf8');  
        
    res.send(csvJSON(csvData));
});

module.exports = app;
