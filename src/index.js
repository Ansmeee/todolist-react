import React from 'react';
import ReactDOM from 'react-dom';
import '../src/assets/style/index.css';
import 'antd/dist/antd.css';
import Routes from "./routes/index";
import { StoreProvider } from "./store";
ReactDOM.render(
  <StoreProvider><Routes></Routes></StoreProvider>,
  document.getElementById('root')
);