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
    payout1
    payout2
    payout3
    payout4
    payout5
    payout6
    payout7
    payout8
    payout9
  }
}` );

var argv = require( 'yargs' )
    .string( 'tournamentId' )
    .string( 'state' )
    .number( 'numberOfEntrants' )
    .number( 'numberOfPlayersRemaining' )
    .number( 'numberOfRebuys' )
    .number( 'currentLevelIndex' )
    .number( 'payout1' )
    .number( 'payout2' )
    .number( 'payout3' )
    .number( 'payout4' )
    .number( 'payout5' )
    .number( 'payout6' )
    .number( 'payout7' )
    .number( 'payout8' )
    .number( 'payout9' )
    .default( 'payout2', 0 )
    .default( 'payout3', 0 )
    .default( 'payout4', 0 )
    .default( 'payout5', 0 )
    .default( 'payout6', 0 )
    .default( 'payout7', 0 )
    .default( 'payout8', 0 )
    .default( 'payout9', 0 )
    .demandOption( [
        'tournamentId',
        'state',
        'numberOfEntrants',
        'numberOfPlayersRemaining',
        'numberOfRebuys',
        'currentLevelIndex',
        'payout1'
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
                currentLevelIndex: argv.currentLevelIndex,
                payout1: argv.payout1,
                payout2: argv.payout2,
                payout3: argv.payout3,
                payout4: argv.payout4,
                payout5: argv.payout5,
                payout6: argv.payout6,
                payout7: argv.payout7,
                payout8: argv.payout8,
                payout9: argv.payout9,
    } } } )
        .then( result => {
            console.log( 'results of mutation: ', result );
        })
        .catch( console.error );
});
