import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify'; // https://fkhadra.github.io/react-toastify/#How-it-works-
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';

import { LoadableWhitePaper } from './components/LoadableWhitePaper';
import { LoadableHome } from './components/LoadableHome';
import { LoadableDashboard } from './components/dash/LoadableDashboard';
import { LoadableMapPage } from './components/dash/LoadableMapPage';
import { LoadableFAQ } from './components/LoadableFAQ';
import Footer from './components/Footer';
import Header from './components/Header';

import { firebaseAuth } from './utils/fire';
import api from './utils/api';

import './App.css';
import './footer.css';
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
  constructor(props) {
    super(props);
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
        const address = localStorage.getItem("address");
        api.postUserQuery(user, address).then((data) => {
          // console.log('retrieved user data', JSON.stringify(data));
          localStorage.setItem("address", data["address"]);
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
              <Route authed={this.state.authed} path="/whitepaper" component={LoadableWhitePaper} />
              <Route authed={this.state.authed} path="/faq" component={LoadableFAQ} />
              <PublicRoute authed={this.state.authed} exact path="/" component={LoadableHome} />
              <PrivateRoute authed={this.state.authed} path="/dashboard" component={LoadableDashboard} />
              <PrivateRoute currentUser={this.state.currentUser} authed={this.state.authed} path="/map" component={LoadableMapPage} />
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
