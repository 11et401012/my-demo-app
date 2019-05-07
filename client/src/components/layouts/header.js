import React, { Component } from 'react'

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
                </nav>
            </div>
        )
    }
}
