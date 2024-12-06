import React, { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import Pagination from "@mui/material/Pagination";
import {
  Container,
  createTheme,
  TableCell,
  LinearProgress,
  ThemeProvider,
  Typography,
  TextField,
  TableBody,
  TableRow,
  TableHead,
  TableContainer,
  Table,
  Paper,
  Box,
  Card,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import axios from "axios";
import { CoinList } from "../api/api";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../context/Context";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
}

export function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function Crypto_data() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { currency, symbol } = CryptoState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const useStyles = makeStyles()(() => {
    return {
      container: {
        padding: isMobile ? "15px" : "30px 0",
      },
      searchField: {
        marginBottom: "2rem",
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          "&:hover fieldset": {
            borderColor: "",
          },
        },
      },
      tableContainer: {
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(10px)",
        overflowX: "auto",
      },
      row: {
        backgroundColor: "transparent",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          transform: "translateY(-2px)",
        },
        fontFamily: "Montserrat",
      },
      pagination: {
        "& .MuiPaginationItem-root": {
          color: "orange",
          fontSize: isMobile ? "0.9rem" : "1.1rem",
          "&:hover": {
            backgroundColor: "rgba(238, 188, 29, 0.1)",
          },
        },
      },
      coinImage: {
        width: isMobile ? "35px" : "50px",
        height: isMobile ? "35px" : "50px",
        borderRadius: "50%",
        objectFit: "cover",
      },
      tableHead: {
        background: "linear-gradient(45deg, #EEBC1D 30%, #FFD700 90%)",
      },
    };
  });

  const { classes } = useStyles();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#EEBC1D",
      },
      mode: "dark",
    },
    typography: {
      fontFamily: "Montserrat, sans-serif",
    },
  });

  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(CoinList(currency));
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCoins();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const handleSearch = () => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(search.toLowerCase())
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="xl" className={classes.container}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          sx={{
            fontWeight: "700",
            marginBottom: "2rem",
            background: "linear-gradient(45deg, orange 30%, orange 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          Cryptocurrency Prices 
        </Typography>
        
        <TextField
          label="Search For a Crypto Currency..."
          variant="outlined"
          fullWidth
          className={classes.searchField}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          size={isMobile ? "small" : "medium"}
        />

        <Card className={classes.tableContainer}>
          {loading ? (
            <LinearProgress sx={{ backgroundColor: "#EEBC1D", height: "3px" }} />
          ) : (
            <TableContainer>
              <Table size={isMobile ? "small" : "medium"}>
                <TableHead>
                  <TableRow className={classes.tableHead}>
                    {["Coin", "Price", "24h Change", "Market Cap"].map((head) => (
                      <TableCell
                        sx={{
                          color: "#000",
                          fontWeight: "800",
                          fontSize: isMobile ? "0.9rem" : "1.1rem",
                          padding: isMobile ? "8px" : "16px",
                        }}
                        key={head}
                        align={head === "Coin" ? undefined : "right"}
                      >
                        {head}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {handleSearch()
                    .slice((page - 1) * (isMobile ? 5 : 10), (page - 1) * (isMobile ? 5 : 10) + (isMobile ? 5 : 10))
                    .map((row) => {
                      const profit = row.price_change_percentage_24h > 0;
                      return (
                        <TableRow
                          onClick={() => navigate(`/coins/${row.id}`)}
                          className={classes.row}
                          key={row.name}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ padding: isMobile ? "8px" : "16px" }}
                          >
                            <Box sx={{ display: "flex", alignItems: "center", gap: isMobile ? 1 : 2 }}>
                              <img
                                src={row.image}
                                alt={row.name}
                                className={classes.coinImage}
                              />
                              <Box>
                                <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ fontWeight: "600" }}>
                                  {row.symbol.toUpperCase()}
                                </Typography>
                                <Typography variant="body2" sx={{ color: "text.secondary", display: isMobile ? "none" : "block" }}>
                                  {row.name}
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem", padding: isMobile ? "8px" : "16px" }}>
                            {symbol}{" "}
                            {numberWithCommas(row.current_price)}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{
                              color: profit ? "rgb(14, 203, 129)" : "red",
                              fontWeight: 600,
                              fontSize: isMobile ? "0.9rem" : "1.1rem",
                              padding: isMobile ? "8px" : "16px",
                            }}
                          >
                            {profit && "+"}
                            {row.price_change_percentage_24h.toFixed(2)}%
                          </TableCell>
                          <TableCell align="right" sx={{ fontSize: isMobile ? "0.9rem" : "1.1rem", padding: isMobile ? "8px" : "16px" }}>
                            {symbol}{" "}
                            {numberWithCommas(
                              Number(row.market_cap.toString().slice(0, -6))
                            )}
                            M
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={Number((handleSearch()?.length / (isMobile ? 5 : 10)).toFixed(0))}
            classes={{ ul: classes.pagination }}
            onChange={(_: unknown, value: number) => {
              setPage(value);
              window.scroll(0, 450);
            }}
            size={isMobile ? "medium" : "large"}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Crypto_data;