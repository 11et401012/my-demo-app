import React, { Component } from 'react'

export default class Login extends Component {
    constructor(props){
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e){
        e.preventDefault();
        
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
                    <form className="m-t" role="form" onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <input type="email" className="form-control" placeholder="Username" required="" />
                        </div>
                        <div className="form-group">
                            <input type="password" className="form-control" placeholder="Password" required="" />
                        </div>
                        <button type="submit" className="btn btn-primary block full-width m-b">Login</button>
                    </form>
                            
                </div>
            </div>
        )
    }
}
