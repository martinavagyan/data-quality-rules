import React, {useState, Fragment} from 'react';
import styled from 'styled-components';
import QueryBuilder from 'react-querybuilder';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {github} from 'react-syntax-highlighter/dist/esm/styles/hljs';
 
const fields = [
  { name: 'gridId', label: 'Company Gridid' },
  { name: 'name', label: 'Company name' },
  { name: 'isClient', label: 'Is company a client ?', value: false }
];

const getInputType = (field, operator) => {
  switch (field) {
    case 'age':
      return 'number';
    default:
      return 'text';
  }
};
 
const Wrapper = styled.div`
  height: 60vh;
  border: 1px solid lightgray;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const Editor = styled.div`
  padding: 0px 30px;
  color: darkblue;
  width: 100%;
  text-align: left;
`;

const Output = styled.div`
  color: darkblue;
  background: rgb(248, 248, 248);
  border-radius: 0px 8px 8px 0px;
  text-align: left;
  padding: 0px 30px;
  font-size: 1em;
  overflow: auto;
`;

const RoleEditor = ({table}) => {
  const [result, setResult] = useState(0);
  return (
    <Fragment>
      {!table && <h3> Please select table to add rules</h3>}
      {table && 
        <Wrapper>
          <Editor>
            <h1>Editor</h1>
            <QueryBuilder fields={fields} onQueryChange={query => setResult(query)} />
          </Editor>
          <Output>
            <h1>Output</h1>
            <SyntaxHighlighter language="JSON" style={github}>
              {JSON.stringify(result, null, 2)}
            </SyntaxHighlighter>
          </Output>
        </Wrapper>
      }
    </Fragment>
  );
};

export default RoleEditor;