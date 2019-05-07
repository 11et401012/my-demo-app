import React, { Component } from 'react'

export default class list extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="ibox float-e-margins">
                        <div className="ibox-content">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered datatableClass" style={{width: '100%'}}>
                                    <thead>
                                        <tr>
                                            <td>Name</td>
                                            <td>Email</td>
                                        </tr>
                                    </thead>
                                    <tbody></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
