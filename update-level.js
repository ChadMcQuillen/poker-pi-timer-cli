"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const mutation = gql(
`mutation UpdateLevel($input: UpdateLevelInput!) {
  updateLevel(input: $input) {
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
}
` );

var argv = require( 'yargs' )
    .string( 'id' )
    .string( 'tournamentId' )
    .number( 'index' )
    .string( 'levelType' )
    .number( 'levelIndex' )
    .number( 'levelTime' )
    .number( 'smallBlind' )
    .number( 'bigBlind' )
    .number( 'ante' )
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

const constructInputFromArgs = ( {
    id,
    index,
    levelType,
    levelIndex,
    levelTime,
    smallBlind,
    bigBlind,
    ante,
    tournamentId,
    ...restOfObject } ) => {
    return( {
        input: {
            id,
            ...( index && { index } ),
            ...( levelType && { levelType } ),
            ...( levelIndex && { levelIndex } ),
            ...( levelTime && { levelTime } ),
            ...( smallBlind && { smallBlind } ),
            ...( bigBlind && { bigBlind } ),
            ...( ante && { ante } )
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
