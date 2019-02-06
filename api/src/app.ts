import express from 'express';
import AuthenticationService from './authenticationService';

const app = express();
const port: number = 3080;

app.use(express.json());
let authenticationService: AuthenticationService = new AuthenticationService();

app.post('/signup/', (request, response) => {
    
});