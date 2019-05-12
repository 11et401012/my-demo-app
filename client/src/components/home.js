import React, { Component } from 'react'
import Navigation from './layouts/navigation';
import Header from './layouts/header';
import { Redirect } from 'react-router';

class Home extends Component {
    constructor(props) {
        super(props);
        // if(Object.keys(this.props.computedMatch.params).length === 0){
        //     <Redirect to="/404" />
        // }
    }

    render() {
        return (
            <div id="wrapper">
                <Navigation/>
                <div id="page-wrapper" className="gray-bg dashbard-1">
                    <Header />
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="wrapper wrapper-content animated fadeInRight">
                                {this.props.children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home;