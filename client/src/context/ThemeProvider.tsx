import { useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeContext } from "./ThemeContext";

const THEME_STORAGE_KEY = "theme";

const getInitialTheme = () => {
  if (typeof window === "undefined") return "light";

  const saved = localStorage.getItem(THEME_STORAGE_KEY);
  if (saved === "dark" || saved === "light") return saved;

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";
    root.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const muiTheme = useMemo(() => {
    const isDark = theme === "dark";

    return createTheme({
      palette: {
        mode: isDark ? "dark" : "light",
        primary: {
          main: "#4f46e5",
        },
        background: {
          default: isDark ? "#020617" : "#f9fafb",
          paper: isDark ? "#0f172a" : "#ffffff",
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiOutlinedInput: {
          styleOverrides: {
            root: ({ theme }) => ({
              borderRadius: 12,
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(2, 6, 23, 0.35)"
                  : "#ffffff",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(148, 163, 184, 0.35)"
                    : "rgba(0, 0, 0, 0.23)",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  theme.palette.mode === "dark"
                    ? "rgba(148, 163, 184, 0.55)"
                    : "rgba(0, 0, 0, 0.45)",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
              },
            }),
          },
        },

        MuiInputLabel: {
          styleOverrides: {
            root: ({ theme }) => ({
              color: theme.palette.text.secondary,
              "&.Mui-focused": {
                color:
                  theme.palette.mode === "dark"
                    ? theme.palette.primary.light
                    : theme.palette.primary.main,
              },
            }),
          },
        },

        MuiIconButton: {
          styleOverrides: {
            root: ({ theme }) => ({
              color: theme.palette.text.secondary,
            }),
          },
        },
      },
    });
  }, [theme]);

  const value = useMemo(() => {
    return {
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
