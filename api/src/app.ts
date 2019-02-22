import cookieParser from 'cookie-parser';
import express, { Application, Request, Response, Router } from 'express';

import AuthenticationService from './authenticationService';
import config from './config';

import UserRoute, { userPath } from './features/user/UserRoute';

const basePath: string = '/api';

const app: Application = express();
const router: Router = express.Router();

router.use(userPath, UserRoute);

const port: number = 3080;

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Set-Cookie');
    response.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express.json());
app.use(cookieParser());

router.post('/signup/', (request, response) => {
    const username: string = request.body.username;
    const password: string = request.body.password;

    if(!username || !password) {
        response.sendStatus(400);
        return;
    }

    AuthenticationService.newUser(username, password).then(signedUp => {
        if(signedUp) {
            response.send('Signed up successfully.\n');
        } else {
            response.send('Username already taken.\n');
        }
    }).catch(error => {
        response.sendStatus(404);
    });
});

router.post('/login/', (request, response) => {
    const username: string = request.body.username;
    const password: string = request.body.password;
    const remember: boolean = request.body.remember;

    AuthenticationService.logIn(username, password, remember).then(token => {
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

router.post('/auth/', (request, response) => {
    const [ selector, validator ] = request.cookies.session.split(':');
    if(!selector || !validator) {
        response.sendStatus(400);
        return;
    }

    const timestamp: number = Date.now();

    AuthenticationService.authenticate(selector, validator, timestamp).then(user => {
        response.json({ username: user });
    }).catch(error => {
        response.sendStatus(401);
    });
});

router.get('/inventory/', (request, response) => {
    if(!request.cookies.session) {
        response.sendStatus(401);
        return;
    }

    const [ selector, validator ] = request.cookies.session.split(':');
    if(!selector || !validator) {
        response.sendStatus(400);
        return;
    }

    const timestamp: number = Date.now();

    AuthenticationService.authenticate(selector, validator, timestamp)
    .then(AuthenticationService.getInventory.bind(AuthenticationService))
    .then(inventory => {
        response.json(inventory);
    }).catch(error => {
        response.sendStatus(401);
    });
});

app.use(basePath, router);

app.listen(port);
