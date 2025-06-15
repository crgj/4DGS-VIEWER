import { Observer } from '@playcanvas/observer';
import { Container, Spinner } from '@playcanvas/pcui/react';
import React from 'react';
import ReactDOM from 'react-dom';

import { ObserverData } from '../types';
import ErrorBox from './errors';
import LeftPanel from './left-panel';
import LoadControls from './load-controls';
import PopupPanel from './popup-panel';
import SelectedNode from './selected-node';
import { version as appVersion } from '../../package.json';

class App extends React.Component<{ observer: Observer }> {
    state: ObserverData = null;

    canvasRef: any;

    constructor(props: any) {
        super(props);

        this.canvasRef = React.createRef();
        this.state = this._retrieveState();

        props.observer.on('*:set', () => {
            // update the state
            this.setState(this._retrieveState());
        });
    }

    _retrieveState = () => {
        const state: any = {};
        (this.props.observer as any)._keys.forEach((key: string) => {
            state[key] = this.props.observer.get(key);
        });
        return state;
    };

    _setStateProperty = (path: string, value: string) => {
        this.props.observer.set(path, value);
    };

    render() {
        return <div id="application-container">
            <Container id="panel-left" flex resizable='right' resizeMin={220} resizeMax={800}>
                <div className="header" style={{ display: 'none' }}>
                    <div id="title">
                        <img src={'static/playcanvas-logo.png'} />
                        <div>{`MODEL VIEWER v${appVersion}`}</div>
                    </div>
                </div>

                <div id="panel-toggle">
                    <img src={'static/playcanvas-logo.png'} />
                </div>


                <LeftPanel observerData={this.state} setProperty={this._setStateProperty} />
            </Container>
            <div id='canvas-wrapper'>

                <div
                    style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        zIndex: 10000
                    }}
                >
                    <button
                        style={{
                            padding: '6px 12px',
                            background: '#333',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                        onClick={() => {
                            (window as any).loadPLYSequence();
                        }}
                    >
                        读取默认模型
                    </button>
                </div>


                <canvas id="application-canvas" ref={this.canvasRef} />
                <div id="loader-progress"
                    style={{
                        position: 'fixed',
                        top: '60%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'white',
                        fontSize: '18px',
                        background: 'rgba(0, 0, 0, 0.75)',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        zIndex: 9999,
                        display: 'none', // 👈 默认隐藏

                    }}
                >
                    加载中...
                </div>
                <LoadControls setProperty={this._setStateProperty} />
                <SelectedNode sceneData={this.state.scene} />
                <PopupPanel observerData={this.state} setProperty={this._setStateProperty} />
                <ErrorBox observerData={this.state} />
                <Spinner id="spinner" size={30} hidden={true} />
            </div>
        </div>;
    }
}

export default (observer: Observer) => {
    // render out the app
    ReactDOM.render(
        <App observer={observer} />,
        document.getElementById('app')
    );
};
