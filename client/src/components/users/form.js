import React, { Component } from 'react';
import axios from 'axios';

export default class form extends Component {
    componentWillMount(){
        const data = {
            start: 0
        };

        axios.post('http://127.0.0.1:3001/users/get', {},{headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer '+'asdasdasdasd'
        })})
        .then(res =>  res.json())
            .then(res =>  {
                console.log(res)
            })
            .catch(res =>  {
                console.log(res)
            })
    }
    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <div className="ibox float-e-margins">
                        <div className="ibox-content">
                            <div className="table-responsive">
                                <table className="table table-striped table-bordered" style={{width: '100%'}}>
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
