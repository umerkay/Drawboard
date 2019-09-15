import React, { Component } from 'react';
import { Spacer, Loading } from './utilities';

import './CreateBoardModal.css';
import OptionSwitch from './OptionSwitch';

import { connect } from 'react-redux';

import { addBoard } from '../actions/boardActions';
import { CirclePicker } from 'react-color';

export class CreateBoardModal extends Component {

    state = {
        BoardType: null,
        form: {
            title: null,
            password: null,
            background: '#ffffff'
        },
        isLoading: false
    }

    setBoardType(value) {
        this.setState({ BoardType: value });
    }

    onChange = e => {
        this.setState({ form: { ...this.state.form, [e.target.name]: e.target.value } })
    }

    onSubmit = e => {
        e.preventDefault();
        const { title, password, background } = this.state.form;
        this.props.addBoard(
            {
                title, password,
                type: this.state.BoardType,
                background
            }
        );
        if (this.props.isAuthorized) this.props.toggle();
        else this.setState({ isLoading: true });
    }

    render() {
        if (!this.props.doRender) return <div></div>
        return (
            <div style={{ zIndex: 1 }}>
                <div style={{
                    position: 'absolute',
                    width: '100vw',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                    height: '100vh', zIndex: 1
                }} onClick={this.props.toggle}>

                </div>

                <div id='createBoardModal'>

                    <div style={{
                        position: 'absolute',
                        padding: '0.5rem',
                        cursor: 'pointer'
                    }} onClick={this.props.toggle}>Cancel</div>

                    <div className='flexbox uc cu full vertical'>
                        <h2>New DrawBoard</h2>

                        <Spacer height='1rem'></Spacer>

                        {this.props.isAuthorized ? null : <span className='alert'>You are not logged in and will need to remember the url and password for the board you create to access it at a later time</span>}

                        <Spacer height='1rem'></Spacer>

                        <OptionSwitch onChange={this.setBoardType.bind(this)} options={['Public', 'Password']} className='dark' ></OptionSwitch>

                        <Spacer height='1rem'></Spacer>

                        {this.state.BoardType === 'Password' ?
                            <span className='center fullWidth'>Your DrawBoard will be protected by a password</span> :
                            <span className='center fullWidth'>Your DrawBoard will be public</span>
                        }

                        <Spacer height='1rem'></Spacer>
                        {
                            this.state.isLoading ?
                                <div className='flexbox uc cu vertical'>
                                    <Loading msg='Mixing Chemicals..'></Loading>
                                </div> :
                                <form onSubmit={this.onSubmit} className="dark flexbox uc cu vertical">
                                    <CirclePicker onChange={({ hex }) => this.onChange({ target: { value: hex, name: 'background' } })} color={this.state.form.background} />
                                    <Spacer height='1rem'></Spacer>
                                    <input required onChange={this.onChange} type="text" placeholder='Title' name='title' maxLength={50} />
                                    <input onChange={this.onChange} type="text" placeholder='Password' name='password' {...(this.state.BoardType !== 'Password' ? { disabled: true } : { required: true })} />
                                    <input type="submit" value="Create" className='btn primary wide' />
                                </form>
                        }

                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isAuthorized: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { addBoard })(CreateBoardModal)
