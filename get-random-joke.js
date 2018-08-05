// Setting up our dependencies
const AWS = require('aws-sdk');
const https = require('https');
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Creating an eviornment variable to store DynamoDB table name
const TABLE_NAME = process.env.table_name;

exports.handler = async (event, context, callback) => {
    
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
};