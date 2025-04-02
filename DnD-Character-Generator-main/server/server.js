
//starts web server
//setup GraphQL server with Apollo Server and Express
//connects database
//handles authentication
//prepares server for frontend




const express = require('express'); //handles HTTP requests and responses
const { ApolloServer} = require('apollo/server'); //framework for building GraphQL servers
const { expressMiddleware } = require('@apollo/server/express4'); // middleware to integrate Apollo Server with Express
const mongoose = require('mongoose'); //bridges javascript and Mongodb
const cors = require('cors'); // communicates frontend on port 3000 with backend on port 4000
const dotnenv = require('dotenv'); //stores our secrets in env files

const typeDefs = require('./graphql/typeDefs'); //defines the graphql schema and types, the info the client asks for
const resolvers = require('./graphql/resolvers'); //resolvers handle the logic for fetching the data requested by the client, they connect the schema to the database
const { authMiddleware} = require('./utils/auth'); //checks for authentication tokens in requests and verifies them

dotnenv.config(); //loads our dirty secrets

const app = express(); //starts express server
const PORT = process.env.PORT || 4000; //backend listens on this port

const startServer = async ()=> //makes sure everything starts at the same timew
{
    const server = new ApolloServer({ 
        typeDefs,
        resolvers,

    });

    await server.start(); //starts appollo with the desired schema and logic

    app.use(cors()); // 3000 can talk to 4000
    app.use(express.json()); // Parse JSON bodies


    app.use('/graphql', expressMiddleware(server, { //sets up the /graphql endpoint for Apollo Server
        context: ({ req }) =>  authMiddleware(req),  // every requests runs authMiddleware to check for authentication tokens and verify them

        }));
        await mongoose.connect(process.env.MONGODB_URI); //connects to mongo database
        console.log('Mongo is connected');
        app.listen(PORT, () => { //starts the express server on the specified port
            
            console.log(`Server is running on http://localhost:${PORT}/graphql`);
        });

    

};
startServer();
