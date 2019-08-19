import React, { Component } from 'react';
import { Spacer, Button } from './utilities';

export class Cover extends Component {
    render() {
        return (
            <div {...this.props} style={{
                padding: '4rem',
                ...this.props.style
            }} className='primary'>
                <div style={{ fontSize: '20px' }} className='flexbox cu vertical full'>
                {/* <h1>DrawBoard</h1> */}
                    <div>
                        <Button href='https://github.com/umerkk164/Drawboard/' classes='white'>GitHub</Button>
                        <Button href='http://github.com/umerkk164' classes='white'>Creator</Button>
                    </div>

                    <Spacer height='1rem'></Spacer>

                    <h1>Draw anything.</h1>
                    <h1>Collaborate on ideas.</h1>
                    <h1>But, together.</h1>

                    <Spacer height='6rem'></Spacer>

                    <span style={{ fontSize: '0.8em' }}>This application is built using the MERN stack, with MongoDB, Express, React and Node.js. This instance is a project demonstration only and not meant for production.</span>
                    <span style={{ fontSize: '0.8em' }} className='mt-1'>It utilises socket.io for real-time drawing and chat messages, and <a href='https://umerkk164.github.io/needlessjs/'>needlessjs</a> for working with HTML canvases</span>
                </div>
            </div>
        )
    }
}

export default Cover
