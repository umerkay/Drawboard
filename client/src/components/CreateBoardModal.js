import React, { Component } from 'react';
import { Spacer } from './utilities';

import './CreateBoardModal.css';
import OptionSwitch from './OptionSwitch';

import { connect } from 'react-redux';

import { addBoard } from '../actions/boardActions';

export class CreateBoardModal extends Component {

    state = {
        BoardType: null,
        form: {
            title: null,
            password: null
        }
    }

    setBoardType(value) {
        this.setState({ BoardType: value });
    }

    onChange = e => {
        this.setState({ form: { ...this.state.form, [e.target.name]: e.target.value } })
    }

    onSubmit = e => {
        e.preventDefault();
        const {title, password} = this.state.form;
        this.props.addBoard(
            {
                title, password,
                type: this.state.BoardType
            }
        );
        this.props.toggle();
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

                        <OptionSwitch onChange={this.setBoardType.bind(this)} options={['Password', 'Public']} className='dark' ></OptionSwitch>

                        <Spacer height='1rem'></Spacer>

                        {this.state.BoardType === 'Password' ?
                            <span className='center fullWidth'>Your DrawBoard will be protected by a password</span> :
                            <span className='center fullWidth'>Your DrawBoard will be public</span>
                        }

                        <Spacer height='1rem'></Spacer>

                        <form onSubmit={this.onSubmit} className="dark flexbox uc cu vertical">
                            <input onChange={this.onChange} type="text" placeholder='Title' name='title' maxLength={50} />
                            <input onChange={this.onChange} type="text" placeholder='Password' name='password' {...(this.state.BoardType !== 'Password' ? { disabled: true } : {})} />
                            <input type="submit" value="Create" className='btn primary wide' />
                        </form>
                    </div>

                </div>
            </div>
        )
    }
}

// const mapStateToProps = state => {

// };

export default connect(null, { addBoard })(CreateBoardModal)
