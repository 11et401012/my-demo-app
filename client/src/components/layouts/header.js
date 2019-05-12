import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class header extends Component {
    render() {
        return (
            <div className="row border-bottom">
                <nav className="navbar navbar-static-top" role="navigation" style={{marginBottom: 0}}>
                    <div className="navbar-header">
                        <a className="navbar-minimalize minimalize-styl-2 btn btn-primary "><
                            i className="fa fa-bars"></i> 
                        </a>
                    </div>
                    <ul className="nav navbar-top-links navbar-right">
                        <li>
                            <Link to ="/logout">
                                <i className="fa fa-sign-out"></i> Log out
                            </Link>
                        </li>
                        
                    </ul>
                </nav>
            </div>
        )
    }
}
