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

  Box,
  Card,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import axios from "axios";
import { CoinList } from "../api/api";
import { useNavigate } from "react-router-dom";
import { CryptoState } from "../context/Context";
import { useApiCache } from "../hooks/useApiCache";

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

const applyFilters = (coins: Coin[], search: string, minPrice: string, maxPrice: string) => {
  return coins.filter((coin) => {
    const matchesSearch = 
      coin.name.toLowerCase().includes(search.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(search.toLowerCase());
    
    const matchesMinPrice = !minPrice || coin.current_price >= Number(minPrice);
    const matchesMaxPrice = !maxPrice || coin.current_price <= Number(maxPrice);

    return matchesSearch && matchesMinPrice && matchesMaxPrice;
  });
};

const applySorting = (coins: Coin[], sortBy: string, sortOrder: string) => {
  return [...coins].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "market_cap":
        comparison = a.market_cap - b.market_cap;
        break;
      case "price":
        comparison = a.current_price - b.current_price;
        break;
      case "change":
        comparison = a.price_change_percentage_24h - b.price_change_percentage_24h;
        break;
      default:
        comparison = 0;
    }
    return sortOrder === "desc" ? -comparison : comparison;
  });
};

function Crypto_data() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("market_cap");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);

  const { currency, symbol } = CryptoState();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const itemsPerPage = isMobile ? 5 : 10;

  const { data: coinsData, loading, error } = useApiCache<Coin[]>(
    CoinList(currency),
    [currency]
  );

  useEffect(() => {
    if (!coinsData) return;
    
    // Apply filters and sorting
    let filtered = applyFilters(coinsData, search, minPrice, maxPrice);
    filtered = applySorting(filtered, sortBy, sortOrder);
    
    // Calculate pagination
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    
    setFilteredCoins(filtered.slice(start, end));
    setTotalCoins(filtered.length);
  }, [coinsData, search, minPrice, maxPrice, sortBy, sortOrder, page, itemsPerPage]);

  const totalPages = Math.ceil(totalCoins / itemsPerPage);

  if (error) {
    return (
      <Container>
        <Typography color="error" variant="h5" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

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
        background: "linear-gradient(45deg, #F29F58 30%, #F29F58 90%)",
      },
      filterContainer: {
        marginBottom: "2rem",
      },
      filterField: {
        minWidth: 120,
        marginRight: isMobile ? "0" : "1rem",
        marginBottom: isMobile ? "1rem" : "0",
      },
    };
  });

  const { classes } = useStyles();
  const navigate = useNavigate();

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#F29F58",
      },
      mode: "dark",
    },
    typography: {
      fontFamily: "Montserrat, sans-serif",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container maxWidth="xl" className={classes.container}>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          sx={{
            fontWeight: "700",
            marginBottom: "2rem",
            background: "linear-gradient(45deg, #F29F58 30%, #F29F58 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: isMobile ? "center" : "left",
            fontFamily: "Montserrat, sans-serif",
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

        <Grid container spacing={2} className={classes.filterContainer}>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth className={classes.filterField}>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="market_cap">Market Cap</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="change">24h Change</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth className={classes.filterField}>
              <InputLabel>Order</InputLabel>
              <Select
                value={sortOrder}
                label="Order"
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Min Price"
              type="number"
              fullWidth
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className={classes.filterField}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              label="Max Price"
              type="number"
              fullWidth
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className={classes.filterField}
            />
          </Grid>
        </Grid>

        <Card className={classes.tableContainer}>
          {loading ? (
            <LinearProgress sx={{ backgroundColor: "orange", height: "3px" }} />
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
                  {filteredCoins.map((row) => {
                    const profit = row.price_change_percentage_24h > 0;
                    return (
                      <TableRow
                        onClick={() => navigate(`/crypto/${row.id}`)}
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
              count={totalPages}
              style={{
                padding: 20,
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
              classes={{ ul: classes.pagination }}
              onChange={(_, value) => {
                setPage(value);
                window.scroll(0, 450);
              }}
            />
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Crypto_data;