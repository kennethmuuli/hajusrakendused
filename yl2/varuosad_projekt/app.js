
const fs = require('fs');
const http = require('http');
// const querystring = require('querystring');
// const URLSearchParams = window.URLSearchParams;
let path = './LE.txt';
 
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
 
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    
    if (req.url == "/favicon.ico") {
        return;
    }
    res.end(readParams(req.url));
    
});

function readParams(paramsStringRaw) {
    let paramsString = paramsStringRaw.slice(2)
    
    let params = new URLSearchParams(paramsString);
    let name = params.get("name");
    let id = params.get("id");

    return search(name, id);


}

function search (name, id) {
    let searchResult = [];

    console.log(name,id)

    if (name != null && id != null) {
        for (let i = 0; i < parsedData.length; i++) {
            
            if (parsedData[i].name.includes(name) && parsedData[i].serial == id) {
                searchResult.push(parsedData[i])
            }
        }
    }
    else if (name != null) {
        for (let i = 0; i < parsedData.length; i++) {
 
            if (parsedData[i].name.includes(name)) {
                searchResult.push(parsedData[i])
            }
    
        }
    }
    else if (id != null) {
        for (let i = 0; i < parsedData.length; i++) {
            
            if (parsedData[i].serial == id) {
                searchResult.push(parsedData[i])
            }
    
        }
    }
    
    searchResult = JSON.stringify(searchResult);
    console.log(searchResult);
    
    return searchResult;
}

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

