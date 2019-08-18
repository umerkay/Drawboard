import React, { Component } from 'react';
import './OptionSwitch.css';

export class OptionSwitch extends Component {

    state = {
        value: null
    }

    componentDidMount() {
        const value = this.props.value || this.props.options[0];
        this.setState({ value });
        if (this.props.onChange) this.props.onChange(value);
    }

    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
        if (this.props.onChange) this.props.onChange(value);
    }

    render() {
        return (
            <div className={"optionSwitch " + (this.props.className || '')}>
                {this.props.options.map((option, i) => (
                    <label key={i} className='optionContainer'>
                        <input
                            className='option'
                            type='radio'
                            checked={this.state.value === option}
                            value={option}
                            onChange={this.handleChange}>
                        </input>
                        <p>{option}</p>
                    </label>
                ))}
            </div>
        )
    }
}

export default OptionSwitch
