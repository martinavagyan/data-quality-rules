import React, {useState} from 'react';
import styled from 'styled-components';
import logo from '../../assets/logo.png';

import { useToasts} from 'react-toast-notifications'

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
  width: 100px;
  background: ${props => props.type === 'secondary' ? 'white': '#1890ff'};
  color: ${props => props.type === 'secondary' ?'#1890ff' : 'white'};
  border-radius: 4px;
  border: 1px solid #1890ff;
  line-height: 1.5;
  font-weight: bold;
  cursor: pointer;
`;

const tableData = {
  name: "domino_grid.csv",
  columns: 
  [
    {
      "name": "gridId",
      "type": "number",
    },
    {
      "name": "name",
      "type": "string",
    },
    {
      "name": "isClient",
      "type": "bool",
    },
  ]
}

const Image = styled.img`
  width: 60px;
`;

const Logo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  justify-items: center;
  align-items: center;
  font-weight: bold;
  color: darkblue;
`;

const initialState = {columns: []};
const ToolBar = ({onTableSelected}) => {
  const { addToast } = useToasts()
  const [table, setTable] = useState({...initialState});

  const onUpload = () => {
    onTableSelected(tableData);
    setTable(tableData);
    addToast('Succesfully uploaded', {
      appearance: 'success',
      autoDismiss: true,
      autoDismissTimeout: 3000,
    })
  };

  return (
    <Wrapper>
      <Button onClick={onUpload}>Upload</Button>
      <span>
        <b>
          {table.name || 'No table selected'}
        </b>
      </span>
      <Logo>Validata <Image src={logo}/></Logo>
    </Wrapper>
  );
};

export default ToolBar;