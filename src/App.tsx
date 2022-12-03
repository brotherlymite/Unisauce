import { BrowserRouter, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import ReactGA from "react-ga";
import "react-toastify/dist/ReactToastify.css";

import Routes from "./components/utils/Routes";
import WalletModal from "./components/wallet/WalletModal";
import GlobalStyle from "./utils/globalStyle";
import { theme } from "./utils/theme";
import WalletConnectModal from "components/wallet/WalletConnectModal";
import CompletedModal from "components/CompletedModal";

ReactGA.initialize("UA-239737204-1");
ReactGA.pageview(window.location.pathname + window.location.search);
function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <WalletConnectModal />
        <CompletedModal />
        <WalletModal />
        <GlobalStyle />
        <BrowserRouter>
          <Switch>
            <Routes />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </>
  );
}

export default App;
