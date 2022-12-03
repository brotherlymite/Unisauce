import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Web3Provider } from "./web3";
import { User } from "./container/user";
import { Flow } from "./container/flow/index";
import { Global } from "./container/global";
import { Connection } from "./container/connection";
import { Contract } from "./container/contract";
import { Transaction } from "container/Transaction";
import TokenFetch from "container/token";

declare global {
  interface Window {
    ethereum: any;
  }
}

const Providers = (
  (...providers: any[]) =>
  ({ children }: { children: React.ReactNode }) => {
    return providers.reduceRight((providers, provider) => {
      const Provider = provider.component || provider;
      const props = provider.props || {};
      return <Provider {...props}>{providers}</Provider>;
    }, children);
  }
)(
  Web3Provider,
  Global.Provider,
  Connection.Provider,
  Contract.Provider,
  TokenFetch.Provider,
  Flow.Provider,
  User.Provider,
  Transaction.Provider
);

ReactDOM.render(
  <React.StrictMode>
    <Providers>
      <App />
    </Providers>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
