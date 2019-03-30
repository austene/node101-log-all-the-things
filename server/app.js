const express = require('express');
const fs = require('fs');
const app = express();
const path = require('path');


app.use((req, res, next) => {
// write your logging code here 
    var userAgent = req.headers['user-agent'].replace(',', '');
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.url;
    var version = 'HTTP/' + req.httpVersion; 
    var status = res.statusCode;
    var loglineData = `${userAgent},${time},${method},${resource},${version},${status}`; 
    console.log(loglineData);
    fs.appendFile(path.join(__dirname, 'log.csv'), loglineData + '\n', (err) => {
        if (err) throw err;
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
    var lines=csv.split('\n');
    var result = [];
    var headers=lines[0].split(',');
    console.log(headers);
    for(var i=1;i<lines.length;i++){
        var obj = {};
        var currentline = lines[i].split(',');
        if (currentline.length < headers.length) {
            continue;
        }

        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    return result; //JavaScript object
    
};

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    var csvLog = path.join(__dirname, 'log.csv');
    var csvData = fs.readFileSync(csvLog, 'utf8');  
        
    res.json(csvJSON(csvData));
});

module.exports = app;
