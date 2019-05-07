import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import store from './store'
import { setCurrentUser, logoutUser } from './actions/authentication';
import { Provider } from 'react-redux'
import Login from './components/login';
import Home from './components/home';
import UserList from './components/users/list';
import NoMatch from './components/404';

if (localStorage.jwtToken !== 'undefined' && localStorage.jwtToken !== undefined) {
		setAuthToken(localStorage.jwtToken);
		const decoded = jwt_decode(localStorage.jwtToken);
		store.dispatch(setCurrentUser(decoded));

		const currentTime = Date.now() / 1000;
		if (decoded.exp < currentTime) {
			store.dispatch(logoutUser());
			window.location.href = '/login'
		}
}else{
		if(window.location.pathname !== '/login'){
				window.location.href = '/login'
		}
}

class App extends Component {
		render() {
				return (
					<Provider store={store}>
						<Router>
							<Switch>
								<Route exact path="/login" component={ Login } />
								<Home>
									<Route exact path="/users/list" component={ UserList } />
									<Route component={ NoMatch } />
								</Home>
							</Switch>
						</Router>
					</Provider>
				);
		}
}

export default App;
