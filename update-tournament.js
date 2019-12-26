"use strict";

global.WebSocket = require( 'ws' );
require( 'es6-promise' ).polyfill();
require( 'isomorphic-fetch' );

const aws_exports = require( './aws-exports' ).default;

const AUTH_TYPE = require( 'aws-appsync/lib/link/auth-link' ).AUTH_TYPE;
const AWSAppSyncClient = require( 'aws-appsync' ).default;

const gql = require( 'graphql-tag' );
const mutation = gql(`
mutation UpdateTournament($input: UpdateTournamentInput!) {
  updateTournament(input: $input) {
    id
    title
    description
    buyIn
    rebuyAmount
    rebuyThroughLevel
    levelsAndBreaks {
      id
      levelType
      levelIndex
      levelTime
      smallBlind
      bigBlind
      ante
      tournamentId
    }
  }
}`);

var argv = require('yargs')
    .describe('id', 'ID of tournament to update')
    .string('title')
    .string('description')
    .number('buyIn')
    .number('rebuyAmount')
    .number('rebuyThroughLevel')
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

var variables = {
    input: {
        id: argv.id
    }
};
if (argv.title !== undefined) {
    variables.input.title = argv.title;
}
if (argv.description !== undefined) {
    variables.input.description = argv.description;
}
if (argv.buyIn !== undefined) {
    variables.input.buyIn = argv.buyIn;
}
if (argv.rebuyAmount !== undefined) {
    variables.input.rebuyAmount = argv.rebuyAmount;
}
if (argv.rebuyThroughLevel !== undefined) {
    variables.input.rebuyThroughLevel = argv.rebuyThroughLevel;
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
