import React, {useState} from 'react';
import './App.css';
import RoleEditor from './components/RoleEditor';
import ToolBar from './components/ToolBar';
import TableExplorer from './components/TableExplorer';

function App() {
  const [table, setTable] = useState();
  return (
    <div className="App">
      <ToolBar onTableSelected={table => setTable(table)}/>
      <TableExplorer table={table}/>
      <RoleEditor table={table}/>
    </div>
  );
}

export default App;
