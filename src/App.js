import React, { Component } from 'react';
import './App.css';
import {Board} from './Board.js'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Board />
        </header>
      </div>
    );
  }
}

export default App;
