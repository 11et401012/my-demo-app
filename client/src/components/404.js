import React, { Component } from 'react'
import Navigation from './layouts/navigation';
import Header from './layouts/header';

class page_404 extends Component {
    render() {
        return (
            <div className="row">
                <div className="col-lg-12">
                    <h1 className='text-center'>No Page Found</h1>
                </div>
            </div>
        )
    }
}

export default page_404;