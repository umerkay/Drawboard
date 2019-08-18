import './utilities.css';
import React, { Component } from 'react';

import LoadingGIF from './loading.gif';

export class Spacer extends Component {
    render() {
        return (
            <div style={{ marginTop: this.props.height || '3rem' }} />
        )
    }
}

export class Loading extends Component {
    render() {
        if (!this.props.msg)
            return (
                <div>
                    <img className='loading' width='50px' src={LoadingGIF} alt="" {...this.props} />
                </div>
            )
        else
            return (
                <div className='flexbox cu uc vertical'>
                    <img className='loading' width='50px' src={LoadingGIF} alt="" {...this.props} />
                    <div className='center'>{this.props.msg}</div>
                </div>
            )
    }
}

export class Button extends Component {

    render() {
        if (this.props.href) {
            return (
                <a {...this.props} style={{ ...this.props.style }} className={'btn ' + this.props.classes} >{this.props.children}</a >
            )
        } else {
            return (
                <button {...this.props} style={{ ...this.props.style }} className={'btn ' + this.props.classes}>{this.props.children}</button>
            )
        }
    }
}