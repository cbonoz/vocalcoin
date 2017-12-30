import React, { Component } from 'react';

import Dashboard from './components/dash/Dashboard';
import MapPage from './components/dash/MapPage';
import WhitePaper from './components/WhitePaper';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './components/Home';

import api from './utils/api';

import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import './App.css';
import './footer.css';

import { firebaseAuth } from './utils/fire';

import { ToastContainer } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/#How-it-works-
import { toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';
import 'react-vis/dist/style.css';

function PrivateRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === true
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />} />
  );
}

function PublicRoute({ component: Component, authed, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => authed === false
        ? <Component {...props} />
        : <Redirect to='/map' />} />
  );
}

class App extends Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      authed: false,
      loading: true,
      currentUser: null
    };
  }

  componentDidMount() {
    const self = this;
    this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      if (user) {
        // console.log('user:', JSON.stringify(user));
        const userId = user.uid;
        api.postUserQuery(user).then((data) => {
          // console.log('retrieved user data', data);

          localStorage.setItem("tok", data["token"]);

          if (!self.state.authed) { // show if there is a change in state.
            toast(<div>Logged in: <b>{user.displayName || user.email.split('@')[0]}</b></div>);
          }

          self.setState({ authed: true, loading: false, currentUser: user });
        }).catch((err) => {
          console.error('error retrieving userId', err);
          const errorAuthed = true;
          self.setState({ authed: errorAuthed, loading: false, currentUser: user });
        });

      } else {
        if (this.state.authed) {
          toast(<div><b>Logged out, come again soon.</b></div>);
        }
        this.setState({
          authed: false,
          loading: false,
          currentUser: user
        })
      }
    })
  }

  componentWillUnmount() {
    this.removeListener()
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Header authed={this.state.authed} />
            <Switch>
              <Route authed={this.state.authed} path="/whitepaper" component={WhitePaper} />
              <Route authed={this.state.authed} path="/faq" component={FAQ} />
              <PublicRoute authed={this.state.authed} exact path="/" component={Home} />
              <PrivateRoute authed={this.state.authed} path="/dashboard" component={Dashboard} />
              <PrivateRoute currentUser={this.state.currentUser} authed={this.state.authed} path="/map" component={MapPage} />
              <Route authed={this.state.authed} render={() => <h1 className="centered">Page not found</h1>} />
            </Switch>
            <Footer />
          </div>
        </Router>
        <ToastContainer position={toast.POSITION.BOTTOM_RIGHT} />
      </div>
    );
  }
}

export default App;
