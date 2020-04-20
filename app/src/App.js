import React, { useState } from "react";
import "./App.css";
import { Input, InputNumber } from "antd";
import QueryBuilder from "react-querybuilder";
import "antd/dist/antd.css";

// These are essentialy the table metadata
const columns = [
  { name: "CODE", type: "number" },
  { name: "NAME", type: "string" },
  { name: "GENERAL_ID", type: "number" }
];

const getColumnBuilderProps = ({ name, type }) => ({
  operators: [
    { name: "IS NULL", label: "IS NULL" },
    { name: "IS NOT NULL", label: "IS NOT NULL" },
    { name: "= ''", label: "IS EMPTY" },
    { name: "!= ''", label: "IS NOT EMPTY" },
    { name: "IN", label: "IN" },
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
        return <InputNumber value={value} onChange={handleOnChange} />;
      }
      return <Input onChange={handleOnChange} />;
    }
  })
});

const toQuery = (input, isParent) => {
  let query = "";
  const { rules: groupRules, combinator: groupCombinator } = input;

  groupRules.forEach(specs => {
    const { field = "", operator = "", value, rules = [] } = specs;

    const prefixOperator = isParent && query === "" ? "" : groupCombinator;
    query += rules.length
      ? toQuery(specs)
      : ` ${prefixOperator} ${field} ${operator} ${value} `;
  });

  return query;
};

const handleQueryChange = (targetColumn, input, currentQueries, setQuery) => {
  const query = toQuery(input, true);
  const newQueries = currentQueries.map(data => {
    if (data.column === targetColumn) {
      return { column: data.column, query };
    }
    return data;
  });
  setQuery(newQueries);
};

function App() {
  const [queries, setQuery] = useState(
    columns.map(({ name }) => ({ column: name, query: "" }))
  );

  return (
    <div className="App">
      {columns.map(specs => (
        <div key={specs.name}>
          <span style={{ display: "inline-flex", margin: "30px" }}>
            <h4 style={{ paddingRight: "15px" }}>{specs.name}</h4>
            <QueryBuilder
              fields={getColumnBuilderProps(specs).fields}
              operators={getColumnBuilderProps(specs).operators}
              controlElements={getColumnBuilderProps(
                specs
              ).getControlElements()}
              onQueryChange={input =>
                handleQueryChange(specs.name, input, queries, setQuery)
              }
            />
          </span>
          <p className="query-panel">
            {queries.find(({ column }) => column === specs.name).query}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
