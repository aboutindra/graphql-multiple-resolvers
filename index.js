import AppServer from './bin/app/server.js';
const port = process.env.PORT;
const App = new AppServer();

App.server.listen(8080, () => {
    const ctx = 'app-listen';
    console.log(ctx, `${App.server.name} started, listening at ${App.server.url}`, 'initiate application');
});
