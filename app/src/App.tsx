import * as React from 'react';
import './App.css';

import Inventory from './inventory/inventory';
import Login from './login/login';

class App extends React.Component {
  public render() {
    return (
      <div>
        <Login />
        <Inventory />
      </div>
    );
  }
}

export default App;
