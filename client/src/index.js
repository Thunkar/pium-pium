import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store';
import { Game } from './components/game';
import './index.css';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const container = document.getElementById('root');
const root = createRoot(container);

const theme = createTheme({
    palette: {
        type: 'dark',
        background: { default: '#000000' },
        text: { primary: '#ffffff' },
        primary: {
            main: '#343434',
        },
        secondary: {
            main: '#1412b7',
        },
        error: {
            main: '#d40000',
        },
    },
});

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Game />
            </ThemeProvider>
        </Provider>
    </React.StrictMode>
);
