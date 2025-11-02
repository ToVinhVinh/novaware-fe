import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './store.js';
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from './themes/theme';
import './assets/scss/style.scss';
import App from './App.jsx';
import axios from 'axios';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

axios.defaults.baseURL = import.meta.env?.VITE_API_URL || 'http://localhost:5000/';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: 1,
			refetchOnWindowFocus: false,
		},
	},
});

const Main = () => {

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App  />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Main />);

