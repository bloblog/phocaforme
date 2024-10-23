import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#FB37A3",
    },
    secondary: {
      main: "#FD9DD1",
    },
    warning: {
      main: "rgba(142, 96, 203, 1)",
    },
    info: {
      main: "#FFFFFF",
    },
    success: {
      main: "rgba(135, 141, 150, 1)",
    },
  },

  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          maxWidth: "100%",
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          width: "8vh",
          height: "8vh",
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        inputRoot: {
          borderRadius: "10px",
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#FD9DD1",
          padding: "0.5rem",
          width: "fit-content",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: "0.5rem 1rem",
          fontSize: "small",
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontFamily: "Pretendard",
          fontSize: "small",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "Pretendard",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: "Pretendard",
          padding: "0rem 1rem",
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        title: {
          fontSize: "18px",
          fontWeight: "bold",
        },
        root: {
          padding: "0.5rem 0",
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          objectFit: "cover",
          borderRadius: "10px",
          height: "9rem",
          width: "7rem",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: "0.2rem 0 0 0",
          cursor: "pointer",
          display: "flex",
          width: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "10px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "Cafe24SSurround",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& input": {
            fontFamily: "Pretendard",
            fontSize: "15px",
          },
          "& .MuiFormHelperText-root": {
            fontFamily: "Pretendard",
          },
        },
      },
    },
  },
});

export default theme;
