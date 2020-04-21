import React, {useState} from 'react';
import './App.css';
import RoleEditor from './components/RoleEditor';
import ToolBar from './components/ToolBar';
import { ToastProvider } from 'react-toast-notifications'

function App() {
  const [table, setTable] = useState({columns: []});
  return (
    <ToastProvider>
      <div className="App">
        <ToolBar onTableSelected={table => setTable(table)}/>
        <RoleEditor table={table}/>
      </div>
    </ToastProvider>
  );
}

export default App;
