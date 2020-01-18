"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const mutation = gql(`
mutation DeleteActiveTournament($input: DeleteActiveTournamentInput!) {
  deleteActiveTournament(input: $input) {
    id
  }
}`);

var argv = require('yargs')
    .usage('Usage: $0 --id [tournament id]')
    .describe('id', 'ID of active tournament to delete')
    .demandOption(['id'])
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
                id: argv.id
    } } } )
        .then( result => {
            console.log( 'results of mutation: ', result );
        })
        .catch( console.error );
});
