// Setting up our dependencies
const AWS = require('aws-sdk');
const https = require('https');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Creating an eviornment variable to store DynamoDB table name
const TABLE_NAME = process.env.table_name;

exports.handler = async (event, context, callback) => {
    
    // Build out GET request options
    const options = {
        host: 'icanhazdadjoke.com',
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    };
    
    // Creates a promise to retrieve data from 
    // jokes api and insert it into DB.
    return new Promise((resolve, reject) => {
            https.get(options, function(res) {
            // Continuously update stream with data
            var body = '';
            res.on('data', function(d) {
                body += d;
            });
            res.on('end', function() {
                const jsonBody = JSON.parse(body);
                var params = {
                    TableName:TABLE_NAME,
                    Item:{
                        'joke_id': jsonBody.id,
                        'joke': jsonBody.joke
                    }
                };
                
                const jokeInsert = dynamodb.put(params).promise();
                
                jokeInsert.then((data, err) => {
                    if (err) { 
                        console.error('Error adding joke to DynamoDB. ');
                        reject('Error adding joke to DynamoDB.');
                    } else {
                        console.log('Successfully added new joke to DynamoDB. ', jsonBody);
                        resolve(jsonBody);
                    }
                    
                });
            });
            res.on('error', function(e) {
                console.error('Error calling external API. ');
                reject('Error calling external API. ');
            });
        });
     });
};
