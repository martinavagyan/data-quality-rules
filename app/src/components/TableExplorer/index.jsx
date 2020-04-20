import React from 'react';

const TableExplorer = ({table =[]}) => {
  return (
    <ul>
      {table.map(item => <li><b>item.column: </b>item.type</li>)}
    </ul>
  );
};

export default TableExplorer;