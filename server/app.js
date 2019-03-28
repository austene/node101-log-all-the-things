const express = require('express');
const fs = require('fs');
const app = express();


app.use((req, res, next) => {
// write your logging code here 
    var userAgent = req.headers['user-agent'];
    var time = new Date().toISOString();
    var method = req.method;
    var resource = req.url;
    var version = 'HTTP/' + req.httpVersion; 
    var status = res.statusCode;
    var loglineData = `${userAgent},${time},${method},${resource},${version},${status}`; 

    fs.appendFile('log.csv', loglineData + '\n', (err) => {
        if (err) throw err;
        console.log('wrote to log.csv');
    });
    next();
});


app.get('/', (req, res) => {
// write your code to respond "ok" here
    console.log();
    res.send('ok');
    res.status('200');
    return;
});

app.get('/logs', (req, res) => {
// write your code to return a json object containing the log data here
    var csvLog = '../log.csv';
    fs.readFile(csvLog, function read(err, data) {
        if (err) {
            throw err;
        }
        csvData = data;
    });    
    //var csv is the CSV file with headers
        function csvJSON(csv){
        
            var lines=csv.split("\n");
            var result = [];
            var headers=lines[0].split(",");
            for(var i=1;i<lines.length;i++){
                var obj = {};
                var currentline=lines[i].split(",");
                for(var j=0;j<headers.length;j++){
                    obj[headers[j]] = currentline[j];
                }
                result.push(obj);
            }
            return result; //JavaScript object
            //return JSON.stringify(result); //JSON
        }
        res.send(csvJSON);
});

module.exports = app;
