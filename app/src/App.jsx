import React, {useState} from 'react';
import './App.css';
import RoleEditor from './components/RoleEditor';
import ToolBar from './components/ToolBar';

function App() {
  const [table, setTable] = useState({columns: []});
  return (
    <div className="App">
      <ToolBar onTableSelected={table => setTable(table)}/>
      <RoleEditor table={table}/>
    </div>
  );
}

export default App;
