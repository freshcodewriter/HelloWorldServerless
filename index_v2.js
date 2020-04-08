const https = require('https');
exports.handler = async (event) => {
    let dataString = '';
    
    const response = await new Promise((resolve, reject) => {
        let name = "you";
        let day = '';
        let responseCode = 200;
        if (event.queryStringParameters && event.queryStringParameters.name) {
            console.log("Received name: " + event.queryStringParameters.name);
            name = event.queryStringParameters.name;
        }
    
        if (event.headers && event.headers['day']) {
            console.log("Received day: " + event.headers.day);
            day = event.headers.day;
        }
        
        console.log("request: " + JSON.stringify(event));
        
        const req = https.get("https://api.abalin.net/today", function(res) {
          res.on('data', chunk => {
            dataString += chunk;
            console.log(dataString)
          });
          
          res.on('end', () => {
            let namedays = JSON.parse(dataString).data.namedays.us
            let greeting = `Hello, ${name}, the namedays of today in US are ${namedays}.`;
            resolve({
                statusCode: 200,
                body: greeting 
            });
          });
        });
        
        req.on('error', (e) => {
          reject({
              statusCode: 500,
              body: 'Something went wrong!'
          });
        });
    });
    
    return response;
};

