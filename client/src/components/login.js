import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from '../actions/authentication';
import {Redirect} from 'react-router-dom';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: '',
            password: '',
            errors: '',
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleSubmit(e) {
        e.preventDefault();
        const user = {
            email: this.state.email,
            password: this.state.password,
        }
        this.props.loginUser(user);
    }


    componentDidMount() {
        if(this.props.auth.isAuthenticated) {
            // this.props.history.push('/users/list');
            window.location.href='/users/list';
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.auth.isAuthenticated) {
            // this.props.history.push('/users/list')
            window.location.href='/users/list';
        }
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    render() {
        var element = document.querySelector("body");
        element.classList.add("gray-bg");
        return (
            <div className="middle-box text-center loginscreen animated fadeInDown">
                <div>
                    <div>
                        <h1 className="logo-name">IN+</h1>
                    </div>
                    <h3>Welcome to IN+</h3>
                    <p>Perfectly designed and precisely prepared admin theme with over 50 pages with extra new web app views.</p>
                    <p>Login in. To see it in action.</p>
                    {
                        this.state.errors ? 
                        (
                            <div className='alert alert-danger'>
                                {this.state.errors}
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        ) : 
                        ''
                    }
                    <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input type="email" onChange={ this.handleInputChange } className="form-control" placeholder="Username" required="" name='email' />
                        </div>
                        <div className="form-group">
                            <input type="password" onChange={ this.handleInputChange } className="form-control" placeholder="Password" required="" name='password'/>
                        </div>
                        <button type="submit" className="btn btn-primary block full-width m-b">Login</button>
                    </form>
                            
                </div>
            </div>
        )
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.string.isRequired
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
})

export  default connect(mapStateToProps, { loginUser })(Login)