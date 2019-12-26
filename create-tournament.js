"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const mutation = gql(`
mutation CreateTournament($input: CreateTournamentInput!) {
    createTournament( input: $input) {
        id
        title
        description
        buyIn
        rebuyAmount
        rebuyThroughLevel
    }
}`);

var argv = require('yargs')
    .string('title')
    .string('description')
    .number('buyIn')
    .number('rebuyAmount')
    .number('rebuyThroughLevel')
    .demandOption(['title', 'description', 'buyIn', 'rebuyAmount', 'rebuyThroughLevel'])
    .argv;

const client = new AWSAppSyncClient( {
    url: aws_exports.ENDPOINT,
    region: aws_exports.REGION,
    auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: aws_exports.API_KEY,
    },
    disableOffline: true
} );

client.hydrated().then( function( client ) {
    client.mutate( {
        mutation: mutation,
        variables: {
            input: {
                title: argv.title,
                description: argv.description,
                buyIn: argv.buyIn,
                rebuyAmount: argv.rebuyAmount,
                rebuyThroughLevel: argv.rebuyThroughLevel
    } } } )
        .then( result => {
            console.log( 'results of mutation: ', result );
        })
        .catch( console.error );
});
