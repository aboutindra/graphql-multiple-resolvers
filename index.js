const appServer = require('./bin/app/server.js');
const AppServer = new appServer();
const port = process.env.PORT;

async function StartServer(){
    const app = AppServer.app;
    await AppServer.server.start();

    AppServer.server.applyMiddleware({app})
    AppServer.app.listen(8080, async () => {
        const ctx = 'app-listen';
        console.log(ctx, `started, listening at 8080`, 'initiate application');
    })
}

StartServer()
