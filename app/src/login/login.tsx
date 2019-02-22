import * as React from 'react';

import InventoryStore from 'src/inventory/InventoryStore';
import apiService from 'src/services/apiService';

interface LoginState {
    username: string;
    password: string;
    login: boolean;
    signup: boolean;
}

const updateState = (key: keyof LoginState, value: any) => (
    prevState: LoginState
): LoginState => ({
    ...prevState,
    [key]: value,
});

class Login extends React.Component<any, LoginState> {
    constructor(props: any) {
        super(props);
        this.state = {
            username: '',
            password: '',
            login: true,
            signup: false
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSetLogin = this.handleSetLogin.bind(this);
        this.handleSetSignup = this.handleSetSignup.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    public render(): React.ReactNode {
        return (
            <form onSubmit={this.handleSubmit}>
                <input type='text' name='username' value={this.state.username} onChange={this.onChangeUsername}/>
                <input type='password' name='password' value={this.state.password} onChange={this.onChangePassword}/>
                <input type='radio' name='type' value='login' onChange={this.handleSetLogin} defaultChecked/>Login
                <input type='radio' name='type' value='signup' onChange={this.handleSetSignup}/>Signup
                <input type='submit' value='submit'/>
            </form>
        );
    }

    private handleSubmit(event: React.FormEvent): void {
        event.preventDefault();

        apiService.post(this.state.login ? '/login' : '/signup', this.state).then(result => {
            if(this.state.login) {
                InventoryStore.fetchInventory();
            }
        }).catch(error => {
            console.error(error);
        });
    }

    private handleSetLogin(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(updateState('login', event.target.checked));
        this.setState(updateState('signup', !event.target.checked));
    }

    private handleSetSignup(event: React.ChangeEvent<HTMLInputElement>) {
        this.setState(updateState('signup', event.target.checked));
        this.setState(updateState('login', !event.target.checked));
    }

    private onChangeUsername(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        this.setState(updateState('username', event.target.value));
    }

    private onChangePassword(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        this.setState(updateState('password', event.target.value));
    }
}

export default Login;
