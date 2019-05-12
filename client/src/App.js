import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Redirect } from 'react-router-dom';
import { Switch, Route, IndexRedirect } from 'react-router';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import store from './store'
import { setCurrentUser, logoutUser } from './actions/authentication';
import { Provider } from 'react-redux'
import Login from './components/login';
import Home from './components/home';
import UserList from './components/users/list';
import UserForm from './components/users/form';
import NoMatch from './components/404';

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

if (localStorage.jwtToken !== 'undefined' && localStorage.jwtToken !== undefined) {
	//setAuthToken(localStorage.jwtToken);
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
	  
function PrivateRoute({ component: Component, isAuthenticated, ...rest }) {
	return (
		<Route
			{...rest}
			render={props => (
				<Home>
					<Component {...props}/>
				</Home>
			)}
		/>
	)
}

class App extends Component {
	render() {
		return (
			<Provider store={store}>
				<Router>
					<Switch>
					<Route exact path="/login" component={ Login } />
						
						<PrivateRoute
          					isAuthenticated={this.props.isAuthenticated}
							path="/users/list"
							component={UserList}
        				/>
						<Route path="*" component = { NoMatch } />
					</Switch>
				</Router>
			</Provider>
		);
	}
}

export default App;
