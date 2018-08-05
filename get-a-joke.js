// Setting up our dependencies
const AWS = require('aws-sdk');
const https = require('https');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Creating an eviornment variable to store DynamoDB table name
const TABLE_NAME = process.env.table_name;

exports.handler = async (event, context, callback) => {
    const joke_id = event.joke_id;
    
    if(joke_id) {
        var params = {
            TableName:TABLE_NAME,
            ExpressionAttributeValues: {
                ':i': joke_id
            },
            FilterExpression: 'joke_id IN (:i)',
        };
                        
        const listJokes = dynamodb.scan(params).promise();
        
        return listJokes.then((data, err) => {
            if(err) console.err(err);
            return data.Items[0];
        });
    } else {
        var params = {
            TableName:TABLE_NAME
        };
                    
        const listJokes = dynamodb.scan(params).promise();
        
        return listJokes.then((data, err) => {
            if(err) console.err(err);
            const jokeCount = data.Count;
            const randomJoke = Math.floor(Math.random() * jokeCount);
            return data.Items[randomJoke];
        });
    }
};