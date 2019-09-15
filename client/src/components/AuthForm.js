import React, { Component } from 'react'
import OptionSwitch from './OptionSwitch';
import { Spacer, Button, Loading } from './utilities';

import { login, register, clearErrors } from '../actions/authActions';

import { connect } from 'react-redux';

export class AuthForm extends Component {

  state = {
    AuthType: null,
    form: {
      username: null,
      password: null,
      email: null
    }
  }

  setAuthType(value) {
    this.props.clearErrors();

    this.setState({
      AuthType: value,
      form: {
        name: null,
        password: null,
        email: null
      }
    });
  }

  onChange = e => {
    this.setState({ form: { ...this.state.form, [e.target.name]: e.target.value } })
  }

  onSubmit = e => {
    e.preventDefault();
    this.props.clearErrors();

    const { name, password, email } = this.state.form;
    const credentials = { name, password, email };

    if (this.state.AuthType === 'SignIn') this.props.login(credentials)
    else if (this.state.AuthType === 'Register') this.props.register(credentials)
  }

  render() {
    return (
      <div
        style={{ ...this.props.style }}
        className='flexbox cu uc full vertical p4'>

        <h1>Authenticate</h1>

        <Spacer height='0.75rem'></Spacer>

        <div>
          <OptionSwitch onChange={this.setAuthType.bind(this)} options={['SignIn', 'Register']}></OptionSwitch>
        </div>

        <Spacer height='3rem'></Spacer>

        {
          <div style={{ minHeight: '200px' }}>

            {this.props.isLoading ?
              <div className='flexbox uc cu vertical full'>
                <Loading msg='Authenticating'></Loading>
              </div>
              : <div>
                {
                  this.props.errors instanceof Array ?
                    <div className='error'>{this.props.errors.map((error, i) => (<p key={i}>{error.msg}</p>))}</div> : null
                }
                {
                  this.state.AuthType === 'SignIn' ?
                    <form onSubmit={this.onSubmit} method="post" className="slidein flexbox uc cu vertical">
                      <div>
                        <input required onChange={this.onChange} type="text" placeholder='Username' name='name' />
                        <input required onChange={this.onChange} type="password" placeholder='Password' name='password' />
                        <input type="submit" value="SignIn" className='btn primary' />
                      </div>
                    </form>
                    : null
                }

                {this.state.AuthType === 'Register' ?
                  <form onSubmit={this.onSubmit} method="post" className="slidein flexbox uc cu vertical">
                    <div>
                      <input required onChange={this.onChange} type="text" placeholder='Username' name='name' />
                      <input required onChange={this.onChange} type="text" placeholder='Email' name='email' />
                      <input required onChange={this.onChange} type="password" placeholder='Password' name='password' />
                      <input type="submit" value="Register" className='btn primary' />
                    </div>
                  </form>
                  : null}

                {this.state.AuthType === 'Facebook' ?
                  <form onSubmit={this.onSubmit} method="post" className="slidein flexbox uc cu vertical">
                    <div>
                      {/* <input type="submit" value="Connect to Facebook" className='btn primary' /> */}
                      Facebook logins are not supported yet
                    </div>
                  </form>
                  : null}
              </div>
            }
          </div>
        }

        <Spacer height='3rem'></Spacer>

        <div className='flexbox uc cu'>
          <h1 className='mr-2'>Or</h1>
          <Button classes='large primary' style={{ flex: 5 }} onClick={this.props.toggleCreateBoard}>Create New Board</Button>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  isLoading: state.auth.isLoading,
  errors: state.auth.errors
});
export default connect(mapStateToProps, { login, register, clearErrors })(AuthForm);