import React from 'react'

export default function Navbar() {
    return (
        <div>
            <div className="bg-dark collapse" id="navbarHeader">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-8 col-md-7 py-4">
                            <h4 className="text-white">About</h4>
                            <p className="text-light">
                                This frontend ui is part of a final project for CS4287 - Cloud Computing and CS6381 - Distributed System taught
                                at Vanderbilt Univeristy. This UI allows user to create process and execute code to be executed by a distributed
                                system with requirements. The frontend will connect with the Go backend to handle construction of Terraform images
                                and deployment of the distributed system. The backend will then connect with the distributed system to execute the provided
                                inputs.
                            </p>
                        </div>
                        <div className="col-sm-4 offset-md-1 py-4">
                            <h4 className="text-white">Team Members</h4>
                            <ul className="list-unstyled">
                                <li><a href="https://www.linkedin.com/in/du-duong/"  target="_blank" and rel="noopener noreferrer" className="text-white">Du Duong</a></li>
                                <li><a href="https://www.linkedin.com/in/nathan-hunsberger/" target="_blank" and rel="noopener noreferrer" className="text-white">Nate Hunsberger</a></li>
                                <li><a href="https://www.linkedin.com/in/berkelunstad/" target="_blank" and rel="noopener noreferrer" className="text-white">Berke Lunstad</a></li>
                                <li><a href="https://www.linkedin.com/in/shivam-vohra" target="_blank" and rel="noopener noreferrer" className="text-white">Shivam Vohra</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="navbar navbar-dark bg-dark box-shadow">
                <div class="container d-flex justify-content-between">
                    <a href="/" class="navbar-brand d-flex align-items-center">
                        <strong className='pr-3'>Code Editor</strong>
                        <i className="fas fa-pen"></i>

                    </a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="true" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                </div>
            </div>
        </div>

    )
}
