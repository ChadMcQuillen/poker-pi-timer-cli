"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const query = gql( `
query ListActiveTournaments(
  $filter: TableActiveTournamentFilterInput
  $limit: Int
  $nextToken: String
) {
  listActiveTournaments(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}` );

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
    client.query( { query: query, fetchPolicy: 'network-only' } )
        .then( result => {
            console.log( 'results of query: ', result.data.listActiveTournaments );
        })
        .catch( console.error );
});
