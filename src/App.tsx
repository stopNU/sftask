import React, { Component } from 'react';
import SimpleTable from './components/table/Table';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      <div style={{padding: '50px'}}>
        <SimpleTable></SimpleTable>
      </div>
      </div>
    );
  }
}

export default App;
