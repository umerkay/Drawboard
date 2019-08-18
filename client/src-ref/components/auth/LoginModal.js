import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input,
    NavLink,
    Alert
} from 'reactstrap';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorsActions';

export class LoginModal extends Component {

    state = {
        modal: false,
        name: '',
        password: '',
        msg: []
    };

    static propTypes = {
        isAuthenticated: PropTypes.bool,
        error: PropTypes.object.isRequired,
        clearErrors: PropTypes.func.isRequired, 
        login: PropTypes.func.isRequired
    }

    componentDidUpdate(prevProps, nextProps) {
        const { error, isAuthenticated } = this.props;

        if (error !== prevProps.error) {
            if (error.id === 'LOGIN_FAIL') {
                this.setState({ msg: error.msg });
            } else {
                this.setState({ msg: [] });
            }
        }
        //if authenticated, close modal
        if(this.state.modal) {
            if(isAuthenticated) {
                this.toggle();
            }
        }
    }

    toggle = () => {
        this.props.clearErrors();
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.clearErrors();

        const { name, password } = this.state;
        const credentials = { name, password };
        this.props.login(credentials);
    }

    render() {
        return (
            <div>
                <NavLink
                    href="#"
                    onClick={this.toggle}
                >Login</NavLink>

                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader toggle={this.toggle}>Login</ModalHeader>
                    <ModalBody>
                        {this.state.msg.map((msg, i) => (<Alert color="danger" key={i}>{msg}</Alert>))}

                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>

                                <Label for="name">Username</Label>
                                <Input
                                    type="text"
                                    name="name"
                                    id="name"
                                    placeholder="Username"
                                    className="mb-3"
                                    onChange={this.onChange}
                                    required
                                ></Input>

                                <Label for="password">Password</Label>
                                <Input
                                    type="password"
                                    name="password"
                                    id="password"
                                    placeholder="Password"
                                    className="mb-3"
                                    onChange={this.onChange}
                                    required
                                ></Input>

                                <Button
                                    type="submit"
                                    color="dark"
                                    style={{ marginTop: "0.5rem" }}
                                    block
                                >
                                    Login
                                </Button>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
    error: state.error
});

export default connect(mapStateToProps, { login, clearErrors })(LoginModal);
