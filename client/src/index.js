import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { Game } from './components/game';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const container = document.getElementById('root');
const root = createRoot(container);

const theme = createTheme({
    palette: {
        type: 'dark',
        primary: {
            main: '#9c9c9c',
        },
        secondary: {
            main: '#3789ff',
        },
    },
});

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Game />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
