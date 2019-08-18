import React, { Component } from 'react';
import loadingGif from './loading.gif';

export class Loading extends Component {
    render() {
        if (this.props.fill === 'inline')
            return (
                <>
                    <img src={loadingGif} alt="" width="30" />
                    <span>
                        {this.props.msg || ""}
                    </span>
                </>
            )
        else return (
            <>
                <img src={loadingGif} alt="" width="30" style={{ display: "block", margin: "auto" }} />
                <div style={{ textAlign: "center" }}>
                    {this.props.msg || "Loading..."}
                </div>
            </>
        )
    }
}

export default Loading
