import {
    AppBar,
    Container,
    MenuItem,
    Select,
    Toolbar,
    Typography,
  } from "@mui/material";
  import {
    createTheme,
    ThemeProvider,
  } from "@mui/material/styles";
  import { useNavigate } from "react-router-dom";
  import { SelectChangeEvent } from "@mui/material";
  import { CryptoState } from "../context/Context.tsx";
  
  const useStyles = {
    title: {
      flex: 1,
      color: "orange", 
      font: "gilroy",
      fontWeight: "bold",
      cursor: "pointer",
    },
  };
  
  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });
  
  function Header() {
    const { currency, setCurrency } = CryptoState();
    

    const handleChange = (event: SelectChangeEvent) => {
      setCurrency(event.target.value);
    };


    const navigate = useNavigate();
  
    return (
      <ThemeProvider theme={darkTheme}>
        <AppBar color="transparent" position="static">
          <Container>
            <Toolbar>
              <Typography
                onClick={() => navigate("/")}
                variant="h6"
                sx={useStyles.title}
              >
                Crypto Tracker
              </Typography>
              {/* <Button color="inherit">Login</Button> */}
              <Select
                variant="outlined"
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currency}
                style={{ width: 100, height: 40, marginLeft: 15 }}
                onChange={handleChange}
              >
                <MenuItem value={"USD"}>USD</MenuItem>
                <MenuItem value={"INR"}>INR</MenuItem>
              </Select>
            </Toolbar>
          </Container>
        </AppBar>
      </ThemeProvider>
    );
  }
  
  export default Header;


