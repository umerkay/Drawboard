import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap';
import { connect } from 'react-redux';
import { addBoard } from '../actions/boardActions';
import PropTypes from 'prop-types';

export class BoardModal extends Component {

    state = {
        modal: false,
        title: '',
        password: ''
    }

    static propType = {
        isAuthenticated: PropTypes.bool
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    }

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.addBoard(
            {
                title: this.state.title,
                password: this.state.password
            }
        );
        this.toggle();
    }

    render() {
        return (
            <div>
                {
                    this.props.isAuthenticated ?
                        <Button
                            color="dark"
                            style={{ marginBottom: "2rem" }}
                            onClick={this.toggle}
                        >Create Board</Button> :
                        null
                }


                <Modal
                    isOpen={this.state.modal}
                    toggle={this.toggle}
                >
                    <ModalHeader toggle={this.toggle}>Create new Drawboard</ModalHeader>
                    <ModalBody>
                        <Form onSubmit={this.onSubmit}>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    placeholder="Title"
                                    className="mb-3"
                                    onChange={this.onChange}
                                    required
                                    autoComplete="none"
                                ></Input>

                                <Label for="password">Password</Label>
                                <Input
                                    type="text"
                                    name="password"
                                    id="password"
                                    className="mb-3"
                                    placeholder="Password"
                                    onChange={this.onChange}
                                    required
                                    autoComplete="none"
                                ></Input>
                                <Button
                                    type="submit"
                                    color="dark"
                                    style={{ marginTop: "0.5rem" }}
                                    block
                                >
                                    Add
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
    board: state.board,
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { addBoard })(BoardModal);
