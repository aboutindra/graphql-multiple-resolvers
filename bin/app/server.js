const cors = require('cors');
const express = require('express');
const wrapper = require("../helpers/utils/wrapper");
const { ApolloServer, gql } = require('apollo-server-express');

function AppServer(){

    const typeDefs = gql`
    type Query {
      hello: String
    }
  `;

    const resolvers = {
        Query: {
            hello: () => 'Hello world!',
        },
    };

    this.app = express();
    this.server = new ApolloServer({ typeDefs, resolvers });

    this.app.use(cors());
    this.app.use(express.json())
    this.app.use(express.urlencoded({ extended: true }))

    // const executableSchema = makeExecutableSchema({
    //     typeDefs: [schema],
    //     resolvers,
    // });
    //
    //
    this.app.get('/', (req, res) => {
        wrapper.response(res, 'success', wrapper.data('Index'), 'This service is running properly');
    });

    // Users.routes(this.server);
    // wallet.routes(this.server);
    // camapign.routes(this.server);
    // transaction.routes(this.server);

    // databasePooling.init();
}

module.exports = AppServer;
