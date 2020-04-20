import React, {Fragment} from 'react';
import styled from 'styled-components';

const Columns = styled.ul`
  list-style-type:none;
`

const TableExplorer = ({table ={}}) => {
  console.log(table);
  return (
    <Fragment>
      {table.columns && 
        <Columns>
          {table.columns.map(column => <li><b>{column.name}: </b>{column.type}</li>)}
        </Columns>
      }
    </Fragment>
  );
};

export default TableExplorer;