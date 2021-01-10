import React, { Suspense } from "react";

import "./App.css";

import Nav from "./components/Navbar/Nav";
import News from "./components/News/News";
import Music from "./components/Music/Music";
import Settings from "./components/Settings/Settings";
import {
  HashRouter,
  Redirect,
  Route,
  Switch,
  withRouter,
} from "react-router-dom";
import { RootStoreType } from "./redux/store";

import HeaderContainer from "./components/Header/HeaderContainer";
import LoginPage from "./components/Login/Login";
import { connect, Provider } from "react-redux";
import { compose } from "redux";
import { initializeApp } from "./redux/app-reducer";
import PreLoader from "./components/Common/Preloader/Preloader";
import store from "./redux/reduxStore";
import { withSuspense } from "./hoc/withSuspense";
import UsersContainerHook from "./components/Users/UsersContainerHook";

const DialogsContainer = React.lazy(
  () => import("./components/Dialogs/DialogsContainer")
);
const ProfileContainer = React.lazy(
  () => import("./components/Profile/ProfileContainer")
);
const UsersContainer = React.lazy(
  () => import("./components/Users/UsersContainer")
);

type appType = {
  initialized: boolean;
};

type AppPropsType = {
  store: RootStoreType;
  initializeApp: () => void;
  app: appType;
  initialized: boolean;
};

class App extends React.Component<AppPropsType> {
  catchAllUnhandledErrors = (promiseRejectionEvent: any) => {
    alert("Some error Occurred");
    // console.error(promiseRejectionEvent);
  };

  componentDidMount() {
    this.props.initializeApp();
    window.addEventListener("unhandledrejection", this.catchAllUnhandledErrors);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "unhandledrejection",
      this.catchAllUnhandledErrors
    );
  }

  render() {
    if (!this.props.initialized) {
      return <PreLoader />;
    }

    return (
      <div className="app-wrapper">
        <HeaderContainer />
        <Nav />
        <div className="app-wrapper-content">
          <Switch>
            <Route exact render={() => <Redirect to={"/profile"} />} path="/" />
            <Route
              exact
              render={withSuspense(DialogsContainer)}
              path="/dialogs"
            />
            <Route
              exact
              render={withSuspense(ProfileContainer)}
              path="/profile/:userId?"
            />
            <Route exact component={News} path="/news" />
            <Route exact component={Music} path="/music" />
            <Route exact component={Settings} path="/settings" />
            <Route
              exact
              render={() => <UsersContainer pageTitle={"Самураи"} />}
              path="/users"
            />
            <Route exact render={withSuspense(LoginPage)} path="/login" />
            <Route exact render={() => <div>404 Not Found</div>} path="*" />
          </Switch>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppPropsType) => ({
  initialized: state.app.initialized,
});

let AppContainer = compose<any>(
  withRouter,
  connect(mapStateToProps, { initializeApp })
)(App);

export const SamuraiJSApp = () => {
  return (
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Provider store={store}>
        <Suspense fallback={<div>Loading... </div>}>
          <AppContainer />
        </Suspense>
      </Provider>
    </HashRouter>
  );
};

export default SamuraiJSApp;
