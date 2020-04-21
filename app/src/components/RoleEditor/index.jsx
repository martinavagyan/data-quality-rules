import React, {useState, Fragment, useEffect} from 'react';
import styled from 'styled-components';
import QueryBuilder from 'react-querybuilder';
import SyntaxHighlighter from 'react-syntax-highlighter';
import {github} from 'react-syntax-highlighter/dist/esm/styles/hljs';
import Select from 'react-select';
import {useToasts} from 'react-toast-notifications'
 
const template = state => ({
  "source_table": {
    "name": "test.data_test",
    "id_column": "GENERAL_ID",
    "unique_per_cols": ['GENERAL_ID', 'ULTIMATE_PARENT_ID'],
    "fuzzy_deduplication_distance": 1,
    "output_correctness_table": "test.data_test_correctness",
    "output_completeness_table": "test.data_test_completeness",
    "output_comparison_table": "test.data_test_comparison"
  },
  "correctness_validations": [...state.correctness_validations],
  "completeness_validations": [...state.completeness_validations],
  "parent_children_constraints": [...state.parent_children_constraints],
  "compare_related_tables_list": ["test.diff_df", "test.diff_df_2"]
});

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

const Button = styled.button`
  height: 30px;
  background: #1890ff;
  border-radius: 4px;
  border: none;
  color: white;
  line-height: 1.5;
  font-weight: bold;
  cursor: pointer;
  width: 200px;
  margin: 30px;
`;
 
const Wrapper = styled.div`
  height: 70vh;
  border: 1px solid lightgray;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
`;

const Editor = styled.div`
  padding: 0px 30px 50px 30px;
  color: darkblue;
  text-align: left;
  overflow: auto;
  h4 {
    padding: 0px;
    margin: 0px;
    color: #505050;
    font-weight: normal;
    margin-bottom: 5px;
  }

  .completness {
    display: grid;
    grid-template-columns: 1fr 2fr;
    grid-gap: 8px;
  }

  .ruleGroup {
    padding: 0.5rem;
    border: 1px solid #1890ff;
    border-radius: 4px;
    background: rgba(180, 220, 255, 0.2);

    .rule,
    .ruleGroup {
      margin-top: 0.5rem;
      margin-left: 0.5rem;
    }

    .ruleGroup-combinators.betweenRules {
      margin-top: 0.5rem;
    }

    .ruleGroup-notToggle {
      margin-right: 0.5rem;
    }
  }
`;

const Output = styled.div`
  color: darkblue;
  background: rgb(248, 248, 248);
  border-radius: 0px 8px 8px 0px;
  text-align: left;
  padding: 0px 30px;
  font-size: 0.8em;
  overflow: auto;
`;

const getColumnBuilderProps = ({ name, type }) => ({
  operators: [
    { name: "Is NULL", label: "Is NULL" },
    { name: "Is NOT NULL", label: "Is NOT NULL" },
    { name: "= ''", label: "Is EMPTY" },
    { name: "!= ''", label: "Is NOT EMPTY" },
    { name: "In", label: "In" },
    { name: "=", label: "=" },
    { name: "!=", label: "!=" },
    { name: "<", label: "<" },
    { name: ">", label: ">" },
    { name: "<=", label: "<=" },
    { name: ">=", label: ">=" }
  ],
  fields: [
    { name: name, label: name },
    { name: `CHAR_LENGTH(${name})`, label: `CHAR_LENGTH(${name})` }
  ],
  getControlElements: () => ({
    // This part handles the rendering of input components based on the operator/column DOCTYPE
    // atm the plain Input text element doesnt work somehow the value is a react synthetic event
    // which I am not familiar with yet :p
    valueEditor: specs => {
      const { field, operator, handleOnChange, value } = specs;
      const operatorName = operator.toLowerCase();
      if (
        operatorName.startsWith("is") ||
        ["= ''", "!= ''"].includes(operatorName)
      ) {
        return "";
      }
      if (type === "number" || field === `CHAR_LENGTH(${name})`) {
        return <input value={value} onChange={handleOnChange} />;
      }
      return <input onChange={handleOnChange} />;
    }
  })
});

const toQuery = (input, isParent) => {
  let query = "";
  const mapOperator = {
    "null": "IS NULL",
    "notNull": "IS NOT NULL"
  }
  const { rules: groupRules, combinator: groupCombinator } = input;

  groupRules.forEach(specs => {
    const { field = "", operator = "", value, rules = [] } = specs;

    const prefixOperator = isParent && query === "" ? "" : groupCombinator;
    query += rules.length
      ? toQuery(specs)
      : ` ${prefixOperator} ${field} ${mapOperator[operator] || operator} ${value} `;
  });

  return query;
};

const handleQueryChange = (targetColumn, input, currentQueries, setQuery) => {
  const rule = toQuery(input, true).replace(/\s\s+/g, ' ').trim();
  const newQueries = currentQueries.map(data => {
    if (data.column === targetColumn) {
      return { column: data.column, rule };
    }
    return data;
  });
  setQuery(newQueries);
};

const RoleEditor = ({table = {columns: []}}) => {
  const [queries, setQuery] = useState([]);
  const [parentOf, setParentOf] = useState([]);
  const { addToast } = useToasts()

  const [completnessOperator, setCompletnessOperator] = useState('');
  const [completnessValue, setCompletnessValue] = useState('');

  useEffect(() => {
    setQuery(table.columns.map(({ name }) => ({ column: name, rule: "" })));
  }, [table]);

  const columnMap = table.columns.reduce((map, obj) => {
    map[obj.name] = obj.type;
    return map;
  }, {});
  
  const getInputType = (field, operator) => columnMap['field'] || 'text';

  const body = template(
    {
      correctness_validations: queries,
      completeness_validations: [ {
          "column": "OVER_ALL_COUNT",
          "rule": "OVER_ALL_COUNT " + completnessOperator + " " + completnessValue
        }
      ],
      parent_children_constraints: parentOf,
    }
  );

  const onSubmit = () => {
    fetch('/api/validate', {body: JSON.stringify(body, null, 2), method: 'POST'});
    addToast('Succesfully submited', {
      appearance: 'success',
      autoDismiss: true,
      autoDismissTimeout: 3000,
    });
  };

  return (
    <Fragment>
      {table.columns.length == 0 && <h3> Please select table to add rules</h3>}
      {table.columns.length != 0 && 
        <Wrapper>
          <Editor>
            <h1>Editor</h1>
            <h3>Correctness validations</h3>
            {
              table.columns.map(specs => (
                <div key={specs.name}>
                  <h4>{specs.name}: [{specs.type}]</h4>
                  <QueryBuilder 
                    fields={getColumnBuilderProps(specs).fields} 
                    getInputType={getInputType}
                    onQueryChange={query => handleQueryChange(specs.name, query, queries, setQuery)}
                    />
                    <br/>
                </div>
              ))
            }
            <h3>completeness validations</h3>
            <h4>Number of rows</h4>
            <div class="completness">
              <Select
                onChange={ selectedOption => setCompletnessOperator(selectedOption.value)}
                options={[
                  { value: '>', label: '>' },
                  { value: '>=', label: '>=' },
                  { value: '=', label: '=' },
                  { value: '<', label: '<' },
                  { value: '<=', label: '<=' },
                ]}
              />
              <input type='number' onChange={e => setCompletnessValue(e.target.value)}></input>
            </div>
            <h3>Parent of constraints</h3>
            {
              table.columns.map(specs => (
                <div key={specs.name}>
                  <h4>{specs.name}: [{specs.type}]</h4>
                  <Select
                    isMulti
                    onChange={selectedOptions => {
                      const newSelection = (selectedOptions || []).map(selectedOption => (
                        {
                          "column": specs.name,
                          "parent": selectedOption.value
                        }
                      ));
                      const oldSelection = parentOf.filter(item => item.column != specs.name);
                      setParentOf(newSelection.concat(oldSelection));
                    }}
                    options={table.columns.filter(item => item.name != specs.name).map(item => ({
                      value: item.name,
                      label: item.name,
                    }))}
                  /><br/>
                </div>
              ))
            }
          </Editor>
          <Output>
            <h1>Output</h1>
            <SyntaxHighlighter language="JSON" style={github}>
              {JSON.stringify(body, null, 2)}
            </SyntaxHighlighter>
          </Output>
        </Wrapper>
      }
      {table.columns.length != 0 && <Button onClick={onSubmit}>Submit</Button>}
    </Fragment>
  );
};

export default RoleEditor;