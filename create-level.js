"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const mutation = gql(`
mutation CreateLevel($input: CreateLevelInput!) {
  createLevel(input: $input) {
    id
    index
    levelType
    levelIndex
    levelTime
    smallBlind
    bigBlind
    ante
    tournamentId
  }
}`);

var argv = require('yargs')
    .string('tournamentId')
    .number('index')
    .string('levelType')
    .number('levelIndex')
    .number('levelTime')
    .number('smallBlind')
    .number('bigBlind')
    .number('ante')
    .demandOption(['tournamentId', 'index', 'levelType', 'levelIndex', 'levelTime', 'smallBlind', 'bigBlind', 'ante'])
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
                tournamentId: argv.tournamentId,
                index: argv.index,
                levelType: argv.levelType,
                levelIndex: argv.levelIndex,
                levelTime: argv.levelTime,
                smallBlind: argv.smallBlind,
                bigBlind: argv.bigBlind,
                ante: argv.ante
    } } } )
        .then( result => {
            console.log( 'results of mutation: ', result );
        })
        .catch( console.error );
});
