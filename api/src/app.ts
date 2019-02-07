import express from 'express';
import AuthenticationService from './authenticationService';

const app = express();
const port: number = 3080;

app.use(express.json());
const authenticationService: AuthenticationService = new AuthenticationService();

app.post('/signup/', (request, response) => {
    const username: string = request.body.username;
    const password: string = request.body.password;

    authenticationService.newUser(username, password).then(signedUp => {
        if(signedUp) {
            response.send("Signed up successfully.\n");
        } else {
            response.send("Username already taken.\n");
        }
    });
});

app.post('/login/', (request, response) => {
    const username: string = request.body.username;
    const password: string = request.body.password;
    const remember: boolean = request.body.remember;

    authenticationService.logIn(username, password, remember).then(token => {
        response.send(token);
    }).catch(error => {
        response.send(`Login failed: ${error.message}`);
    });
});

app.post('/auth/', (request, response) => {
    const selector: string = request.body.selector;
    const validator: string = request.body.validator;
    const timestamp: Date = new Date(Date.now());

    authenticationService.authenticate(selector, validator, timestamp).then(user => {
        response.send(`Authenticated as ${user}.`);
    }).catch(error => {
        response.send(`Authentication failed: ${error.message}`);
    });
});

app.listen(port);
