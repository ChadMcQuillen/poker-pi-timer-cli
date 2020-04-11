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
    }
    nextToken
  }
}` );
const mutation = gql(`
mutation DeleteActiveTournament($input: DeleteActiveTournamentInput!) {
  deleteActiveTournament(input: $input) {
    id
  }
}`);

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
            result.data.listActiveTournaments.items.forEach( activeTournament => {
                console.log( 'Deleting active tournament ', activeTournament.id );
                client.mutate({
                    mutation: mutation,
                    variables: {
                        input: {
                            id: activeTournament.id
                        }
                    }
                })
                .then( result => {
                    console.log( 'results of mutation: ', result );
                })
                .catch( console.error );
            });
        })
        .catch( console.error );
});
