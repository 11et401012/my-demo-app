import React, { Component } from 'react';
import Navigation from './components/layouts/navigation';
import './App.css';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './setAuthToken';
import store from './store'
import { setCurrentUser, logoutUser } from './actions/authentication';
import { Provider } from 'react-redux'
import Login from './components/login';

if (localStorage.jwtToken) {
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
				const hideClass = this.props.isAuthenticated ? '' : 'hide';
				return (
						<Provider store={store}>
								<Router>
										<Route exact path="/login" component={ Login } />
								</Router>
								<div id="wrapper" className={hideClass}>
										<Navigation />
										<div id="page-wrapper" className="gray-bg dashbard-1">
												<div className="row">
														<div className="col-lg-12">
																<div className="wrapper wrapper-content animated fadeInRight">

																</div>
														</div>
												</div>
										</div>
								</div>
						</Provider>
				);
		}
}

export default App;
