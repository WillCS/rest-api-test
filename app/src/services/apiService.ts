const defaultGetOptions: RequestInit = {
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

const defaultPostOptions: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
        'Content-Type': 'application/json'
    }
};

class ApiService {
    public readonly baseURL = 'http://localhost:3080/api';

    public async get(url: string, body?: object) {
        const options: RequestInit = defaultGetOptions;
        options.body = JSON.stringify(body);

        return fetch(this.baseURL + url, options);
    }

    public async post(url: string, body?: object) {
        const options: RequestInit = defaultPostOptions;
        options.body = JSON.stringify(body);

        return fetch(this.baseURL + url, options);
    }
}

export default new ApiService();
