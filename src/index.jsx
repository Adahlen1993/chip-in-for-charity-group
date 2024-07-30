import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/system';
import store from './redux/store';
import App from './components/App/App';
import theme from './components/MUITheme/Muitheme'; // Import your custom theme

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <GlobalStyles
      styles={{
        html: {
          height: '100%',
        },
        body: {
          height: '100%',
          margin: 0,
          backgroundImage: `url(${theme.customBackgroundImage.url})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed', // Ensure the background stays fixed while scrolling
        },
        '#react-root': {
          height: '100%',
        },
      }}
    />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
  document.getElementById('react-root')
);
