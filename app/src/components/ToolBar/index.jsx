import React, {useState} from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  height: 60px;
  border-radius: 8px;
  border: 1px solid lightgrey;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 40px;
`;

const Button = styled.button`
  height: 30px;
  background: #1890ff;
  border-radius: 4px;
  border: none;
  color: white;
  line-height: 1.5;
  font-weight: bold;
  cursor: pointer;
`;

const tableData = {
  name: "domino_grid.csv",
  columns: 
  [
    {
      "column": "gridId",
      "data_type": "number",
    },
    {
      "column": "name",
      "data_type": "string",
    },
    {
      "isClient": "id",
      "data_type": "number",
    },
  ]
}

const ToolBar = ({onTableSelected}) => {
  const [table, setTable] = useState({});
  return (
    <Wrapper>
      <Button onClick={() => {setTable(tableData); onTableSelected(tableData)}}>Upload new</Button>
      <span>
        <b>
          {table.name || 'No table selected'}
        </b>
      </span>
      <Button>Submit</Button>
    </Wrapper>
  );
};

export default ToolBar;