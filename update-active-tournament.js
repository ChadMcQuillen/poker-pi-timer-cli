"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const mutation = gql(
`mutation UpdateActiveTournament($input: UpdateActiveTournamentInput!) {
  updateActiveTournament(input: $input) {
    id
    tournamentId
    state
    numberOfEntrants
    numberOfPlayersRemaining
    numberOfRebuys
    currentLevelIndex
  }
}
` );

var argv = require( 'yargs' )
    .describe( 'id', 'ID of active tournament to update' )
    .string( 'state' )
    .number( 'numberOfEntrants' )
    .number( 'numberOfPlayersRemaining' )
    .number( 'numberOfRebuys' )
    .number( 'currentLevelIndex' )
    .demandOption( [ 'id' ] )
    .choices( 'state', [ 'pending', 'running', 'paused', 'done' ] )
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

var variables = {
    input: {
        id: argv.id
    }
};

if ( argv.state !== undefined ) {
    variables.input.state = argv.state;
}
if ( argv.numberOfEntrants !== undefined ) {
    variables.input.numberOfEntrants = argv.numberOfEntrants;
}
if ( argv.numberOfPlayersRemaining !== undefined ) {
    variables.input.numberOfPlayersRemaining = argv.numberOfPlayersRemaining;
}
if ( argv.numberOfRebuys !== undefined ) {
    variables.input.numberOfRebuys = argv.numberOfRebuys;
}
if ( argv.currentLevelIndex !== undefined ) {
    variables.input.currentLevelIndex = argv.currentLevelIndex;
}

client.hydrated().then( function( client ) {
    client.mutate( {
        mutation: mutation,
        variables: variables
    } )
        .then( result => {
            console.log( 'results of mutation: ', result );
        })
        .catch( console.error );
});
