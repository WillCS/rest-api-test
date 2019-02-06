import express from 'express';
import AuthenticationService from './authenticationService';

const app = express();
const port: number = 3080;

app.use(express.json());
let authenticationService: AuthenticationService = new AuthenticationService();

app.post('/signup/', (request, response) => {
    let username: string = request.body.username;
    let password: string = request.body.password;

    authenticationService.newUser(username, password).then(signedUp => {
        if(signedUp) {
            response.send("Signed up successfully.\n");
        } else {
            response.send("Username already taken.\n");
        }
    });
});

app.post('/login/', (request, response) => {
    let username: string = request.body.username;
    let password: string = request.body.password;
    let remember: boolean = request.body.remember;

    authenticationService.logIn(username, password, remember).then(token => {
        response.send(token);
    }).catch(error => {
        response.send("Login failed.");
    });
});

app.post('/auth/', (request, response) => {
    let selector: string = request.body.selector;
    let validator: string = request.body.validator;
    let timestamp: Date = new Date(Date.now());

    authenticationService.authenticate(selector, validator, timestamp).then(user => {
        response.send(`Authenticated as ${user}.`);
    }).catch(error => {
        response.send("Authentication failed.");
    });
});

app.listen(port);
