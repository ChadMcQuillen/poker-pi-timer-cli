"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const query = gql(`
query QueryLevelsByTournamentIdIndex(
  $tournamentId: ID!
  $first: Int
  $after: String
) {
  queryLevelsByTournamentIdIndex(
    tournamentId: $tournamentId
    first: $first
    after: $after
  ) {
    items {
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
    nextToken
  }
}`);

var argv = require('yargs')
    .usage('Usage: $0 --id [tournament id]')
    .describe('id', 'ID of tournament to list levels')
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
    client.query( {
        query: query,
        variables: {
            tournamentId: argv.id
        },
        fetchPolicy: 'network-only'
    } )
        .then( result => {
            console.log( 'results of query: ', result.data.queryLevelsByTournamentIdIndex );
        })
        .catch( console.error );
});
