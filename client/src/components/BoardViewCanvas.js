import React, { Component } from 'react';
import CanvasDraw from 'react-canvas-draw';

export class BoardViewCanvas extends Component {

    constructor() {
        super();
        this.state = {
            endpoint: 'http://localhost:5000'
        };
    }

    render() {
        return (
            <>
                <div className='flexbox uc cu fullWidth'>
                    <CanvasDraw
                        ref={canvasDraw => (this.canvasDraw = canvasDraw)}
                        style={{
                            margin: '16px'
                        }}
                        canvasWidth={window.innerWidth - 32 - 64}
                        canvasHeight={window.innerHeight - 32}
                        // hideGrid={true}
                        brushRadius={1}
                    ></CanvasDraw>
                </div>
            </>
        )
    }
}

export default BoardViewCanvas
