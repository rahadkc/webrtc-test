import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import { ContextProvider } from './socketContext';
import './styles.css';

const MainApp = () => {
    return (
        <ContextProvider>
            <App/>
        </ContextProvider>
    )
}

ReactDOM.render(<MainApp />, document.getElementById('root'))