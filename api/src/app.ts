import cookieParser from 'cookie-parser';
import express from 'express';

import AuthenticationService from './authenticationService';
import config from './config';

const app = express();
const port: number = 3080;

app.use(express.json());
app.use(cookieParser());

const authenticationService: AuthenticationService = new AuthenticationService();

app.post('/signup/', (request, response) => {
    const username: string = request.body.username;
    const password: string = request.body.password;

    if(!username || !password) {
        response.sendStatus(400);
        return;
    }

    authenticationService.newUser(username, password).then(signedUp => {
        if(signedUp) {
            response.send('Signed up successfully.\n');
        } else {
            response.send('Username already taken.\n');
        }
    }).catch(error => {
        response.sendStatus(404);
    });
});

app.post('/login/', (request, response) => {
    const username: string = request.body.username;
    const password: string = request.body.password;
    const remember: boolean = request.body.remember;

    authenticationService.logIn(username, password, remember).then(token => {
        const cookie: express.CookieOptions = {
            httpOnly: true,
            secure: config.useHTTPS,
            sameSite: 'strict',
            encode: String
        };

        if(remember) {
            cookie.maxAge = 315569260; // 10 Years in seconds
        }

        response.cookie('session', `${token.selector}:${token.validator}`, cookie);
        response.sendStatus(200);
    }).catch(error => {
        response.send(`Login failed: ${error.message}\n`);
    });
});

app.post('/auth/', (request, response) => {
    const [ selector, validator ] = request.cookies.session.split(':');
    if(!selector || !validator) {
        response.sendStatus(400);
        return;
    }

    const timestamp: number = Date.now();

    authenticationService.authenticate(selector, validator, timestamp).then(user => {
        response.sendStatus(200);
    }).catch(error => {
        response.sendStatus(401);
    });
});

app.listen(port);
