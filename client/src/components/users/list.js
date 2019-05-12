import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { getUserData } from '../../actions/authentication';

class list extends Component {
    componentWillMount(){
        const data = {
            start: 0
        };

        // var instance = axios.create({
        //     baseURL: 'http://127.0.0.1:3001/',
        //     headers: {'Authorization': 'Bearer ksdjfglksgflksgsjdhglaslfkhgasf'}
        //   })

        //   instance.get('http://127.0.0.1:3001/users/get')
        // .then(res =>  res.json())
        //     .then(res =>  {
        //         console.log(res)
        //     })
        //     .catch(res =>  {
        //         console.log(res)
        //     })

            fetch('http://127.0.0.1:3001/users/get', {
                method: 'post',
                mode: 'no-cors',
                credentials: 'include',
                headers: {
                    'X-Current-Requests': '1',
                    'X-Custom-Header': 'hello world',
                    'Authorization': 'Bearer '+'asdasdasdasd',
                    "Content-type": "application/json; charset=utf-8",
                },
                body: 'foo=bar&lorem=ipsum'
              })
              .then(res =>  res.json())
              .then(function (data) {
                console.log('Request succeeded with JSON response', data);
              })
              .catch(function (error) {
                console.log('Request failed', error);
              });
            // this.props.getUserData();
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

export  default connect(null, { getUserData })(list)