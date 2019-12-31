"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const mutation = gql( `
mutation CreateActiveTournament($input: CreateActiveTournamentInput!) {
  createActiveTournament(input: $input) {
    id
    tournamentId
    state
    numberOfEntrants
    numberOfPlayersRemaining
    numberOfRebuys
    currentLevelIndex
  }
}` );

var argv = require( 'yargs' )
    .string( 'tournamentId' )
    .string( 'state' )
    .number( 'numberOfEntrants' )
    .number( 'numberOfPlayersRemaining' )
    .number( 'numberOfRebuys' )
    .number( 'currentLevelIndex' )
    .demandOption( [
        'tournamentId',
        'state',
        'numberOfEntrants',
        'numberOfPlayersRemaining',
        'numberOfRebuys',
        'currentLevelIndex'
    ] )
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

client.hydrated().then( function( client ) {
    client.mutate( {
        mutation: mutation,
        variables: {
            input: {
                tournamentId: argv.tournamentId,
                state: argv.state,
                numberOfEntrants: argv.numberOfEntrants,
                numberOfPlayersRemaining: argv.numberOfPlayersRemaining,
                numberOfRebuys: argv.numberOfRebuys,
                currentLevelIndex: argv.currentLevelIndex
    } } } )
        .then( result => {
            console.log( 'results of mutation: ', result );
        })
        .catch( console.error );
});
