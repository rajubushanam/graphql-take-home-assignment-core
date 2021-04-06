const express = require('express');
const {ApolloServer, gql, AuthenticationError} = require('apollo-server-express')
const types = require('./types')
const resolvers = require('./resolvers')
const RETSAPI = require('./datasources/RETSAPI')
const app = express();

const PORT = process.env.PORT || 4000

const typeDefs = gql`${types}`
const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        retsAPI: new RETSAPI()
    }),
    context: ({req}) => {
        const token = req.headers.authorization || ''
        const encodedToken = token.split('Basic ')[1]
        const decodedToken = new Buffer.from(encodedToken, 'base64').toString('ascii')
    
        const userName = decodedToken.split(':')[0]
        console.log("inside context", token, userName);
        if(!userName) {
            throw new AuthenticationError('Log in required')
        } else if(userName !== 'user1@sideinc.com') {
            throw new AuthenticationError('User not authorized')
        }
        return {userName}
    }
});

server.applyMiddleware({ app, path:"/graphql" });

const appServer = app.listen({ port: PORT }, () =>
    console.log(`GraphQL server listening on http://localhost:4000/graphql`)
);

module.exports = {appServer, server, typeDefs}