import React, { Component, Fragment } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    // NavLink,
    Container
} from 'reactstrap';
import Logout from './auth/Logout';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import RegisterModal from './auth/RegisterModal';
import LoginModal from './auth/LoginModal';

class NavbarHeader extends Component {

    state = {
        isOpen: false
    }

    static propTypes = {
        auth: PropTypes.object.isRequired
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <Fragment>
                <NavItem>
                    <span className="navbar-text mr-3">Welcome {user ? user.name : ""}</span>
                </NavItem>
                <NavItem>
                    <Logout></Logout>
                </NavItem>
            </Fragment>
        );

        const guestLinks = (
            <Fragment>
                <NavItem>
                    <RegisterModal></RegisterModal>
                </NavItem>
                <NavItem>
                    <LoginModal></LoginModal>
                </NavItem>
            </Fragment>
        )

        return (
            <Navbar color="dark" dark expand="sm" className="mb-5">
                <Container>
                    <NavbarBrand href="/">Drawboard</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}></NavbarToggler>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            {isAuthenticated ? authLinks : guestLinks}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        )
    }
}
const mapStateToProps = state => ({
    auth: state.auth
});
export default connect(mapStateToProps, null)(NavbarHeader);