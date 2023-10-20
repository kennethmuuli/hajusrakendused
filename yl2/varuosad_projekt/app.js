
const fs = require('fs');
const http = require('http');
let path = 'C:/Users/u-469/Desktop/tunnis/koolirepo/hajus_rakendused/varuosad_projekt/LE.txt';
 
const hostname = '127.0.0.1';
const port = 3000;

let data = fs.readFileSync(path, "utf8");

rows = data.split("\n");
let parsedData = []

let keys = ['serial','name','column3', 'column4','column5', 'column6', 'column7', 'column8', 'hind', 'tootja', 'hind_km']

for (let i = 0; i < rows.length; i++) {
    rows[i] = rows[i].split("\t");

    let obj = {
        // serial: rows[i][0].replaceAll('"',''),
        // serial: rows[i][0].replaceAll('"',''),
        // serial: rows[i][0].replaceAll('"',''),
        // serial: rows[i][0].replaceAll('"',''),
        // serial: rows[i][0].replaceAll('"',''),
    }

    for (let r = 0; r < rows[i].length; r++) {
        // rows[i][r] = rows[i][r].replaceAll('"','');
        obj[ keys[r] ] = rows[i][r].replaceAll('"','');
    }
    parsedData.push(obj);
}

let jsonObj = parsedData.slice(0,10);

jsonObj = JSON.stringify(parsedData);

console.log(jsonObj);

 
const server = http.createServer((req, res) => {
    // console.log(data)
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    res.end(jsonObj);
    
});
 
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

