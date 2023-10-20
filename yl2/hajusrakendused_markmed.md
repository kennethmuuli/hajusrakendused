# Arendusprotsesside juhtimine tundide märkmed

## Ressursid
- Õpetaja repo link: https://github.com/timotr 
    - // Harjutused https://github.com/timotr/harjutused/tree/main/hajusrakendused
- 

<details>

  <Summary>9/21/2023</Summary>

1) URLi ylesehitus:
    Mis asjad on search query parameetrid: URLi lõpus a la "?menu=1?search=test?sort=test"
    Mis asi on path: /public/new_post
    URL = www.example.com/public/new_post?menu=1?search=test?sort=test

2) Mida eeldan, et teate:
    * for tsykkel
    * muutujad
    * kuidas lugeda andmeid array/list tyypi andmestruktuuridest
    * kuidas lugeda andmeid object/Dictionary/Hashmap/map tyypi struktuuridest
    * kuidas toodelda JSON andmeid (serializing)
    * kuidas printida andmeid ekraanile

3) Mida peate voib-olla juurde oppima:
    * mis on HTTP client library
    * kuidas lisada HTTP paiseid (headers)
    * mis on search query parameetrid
    * kuidas paigaldada teiste tehtud koodi kasutades package manager'i
    * mis on laiuskraad/pikkuskraad/koordinaadid 

4) Weather forecast code:

````

/* Kasutab yr.no APIt ja JS Fetch APIt töötamiseks. */

let long = 59.4716889
let lat = 24.7382388
let URL = "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.4716889&lon=24.7382388"

async function logForecast() {
    const response = await fetch(URL);
    const forecast = await response.json();

    console.log('The weather forecast for Tallinn for the next 24h is:')

    for (let i = 0; i < 24; i++) {
        console.log(forecast.properties.timeseries[i].time + ': ' + forecast.properties.timeseries[i].data.instant.details.air_temperature + ' celsius');
    }
}

````

</details>

<details>
  <Summary>9/21/2023</Summary>

1) Alustasime: https://nodejs.org/en/docs/guides/getting-started-guide (Hello world app!)
2) funktsioonid: 
- nameless/anonymous function, näiteks sum = (a,b) => {return a+b;}
- callback function, näiteks sum = (a,b) => a+b;

</details>