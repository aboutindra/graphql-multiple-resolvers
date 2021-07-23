import cors from 'cors';
import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';

// import schema from './data/schema';
// import resolvers from './data/resolvers';

export default function AppServer(){

    this.server = express();
    this.server.use(cors());
    this.server.use(express.json())
    this.server.use(express.urlencoded({ extended: true }))

    // const executableSchema = makeExecutableSchema({
    //     typeDefs: [schema],
    //     resolvers,
    // });
    //
    //
    // this.server.get('/', (req, res) => {
    //     wrapper.response(res, 'success', wrapper.data('Index'), 'This service is running properly');
    // });

    // user.routes(this.server);
    // wallet.routes(this.server);
    // camapign.routes(this.server);
    // transaction.routes(this.server);

    // databasePooling.init();
}
