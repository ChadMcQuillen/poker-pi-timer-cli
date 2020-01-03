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
}
` );

var argv = require( 'yargs' )
    .describe( 'id', 'ID of active tournament to update' )
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

const constructInputFromArgs = ( {
    id,
    state,
    numberOfEntrants,
    numberOfPlayersRemaining,
    numberOfRebuys,
    currentLevelIndex,
    payout1,
    payout2,
    payout3,
    payout4,
    payout5,
    payout6,
    payout7,
    payout8,
    payout9,
    ...restOfObject } ) => {
    return( {
        input: {
            id,
            ...( state && { state } ),
            ...( numberOfEntrants && { numberOfEntrants } ),
            ...( numberOfPlayersRemaining && { numberOfPlayersRemaining } ),
            ...( numberOfRebuys && { numberOfRebuys } ),
            ...( currentLevelIndex && { currentLevelIndex } ),
            ...( payout1 && { payout1 } ),
            ...( payout2 && { payout2 } ),
            ...( payout3 && { payout3 } ),
            ...( payout4 && { payout4 } ),
            ...( payout5 && { payout5 } ),
            ...( payout6 && { payout6 } ),
            ...( payout7 && { payout7 } ),
            ...( payout8 && { payout8 } ),
            ...( payout9 && { payout9 } )
        }
    } );
};

client.hydrated().then( function( client ) {
    client.mutate( {
        mutation: mutation,
        variables: constructInputFromArgs( argv )
    } )
        .then( result => {
            console.log( 'results of mutation: ', result );
        })
        .catch( console.error );
});
