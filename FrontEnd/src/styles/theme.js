import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FB37A3',
    },
    secondary: {
      main: '#FD9DD1',
    },
    warning: {
      main: 'rgba(142, 96, 203, 1)',
    },
    info: {
        main: '#FFFFFF'
    }
  },

  components: {
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#FD9DD1', 
        },
        list: {
          // backgroundColor: '#FD9DD1',
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        secondary: {
          fontSize: '10px'
        }

      }
    },
  
  }
});

export default theme;
