import React, { Component } from 'react';
import Navigation from './components/layouts/navigation';
import './App.css';

class App extends Component {
  render() {
    return (
		<div id="wrapper">
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
    );
  }
}

export default App;
