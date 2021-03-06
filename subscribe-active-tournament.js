"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const subscription = gql(
`subscription OnUpdateActiveTournament($id: ID) {
  onUpdateActiveTournament(id: $id) {
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
    .describe( 'id', 'ID of active tournament to observe' )
    .demandOption( [ 'id' ] )
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
    const observable = client.subscribe({
      query: subscription,
      variables: {
        id: argv.id
      }
    });
    const realtimeResults = function realtimeResults( data ) {
        console.log( '(Realtime Subscription) Subscribing posts -----------> ', data );
    };

    observable.subscribe({
        next: realtimeResults,
        complete: console.log,
        error: console.log,
    });
});
