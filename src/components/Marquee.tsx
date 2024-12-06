import { useEffect, useState } from "react";
import { makeStyles } from "tss-react/mui";
import axios from "axios";
import { TrendingCoins } from "../api/api";
import { CryptoState } from "../context/Context";

const useStyles = makeStyles()(() => {
  return {
    marqueeContainer: {
      width: "100%",
      overflow: "hidden",
      background: "rgba(255, 255, 255, 0.05)",
      padding: "15px 0",
      marginTop: 20,
    },
    marqueeContent: {
      display: "flex",
      animation: "marquee 30s linear infinite",
      whiteSpace: "nowrap",
      "& > div": {
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        color: "#fff",
        fontSize: "16px",
        fontFamily: "Montserrat",
        "& img": {
          width: 35,
          height: 35,
          marginRight: 10
        },
        "& span": {
          color: "#00ff88",
          marginLeft: 5
        }
      },
      "@keyframes marquee": {
        "0%": { transform: "translateX(0)" },
        "100%": { transform: "translateX(-50%)" }
      }
    },
    error: {
      color: "#ff4444",
      padding: "15px",
      textAlign: "center",
      fontFamily: "Montserrat"
    }
  };
});


/* eslint-disable @typescript-eslint/no-explicit-any */
const Marquee = () => {
  const [trending, setTrending] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { currency, symbol } = CryptoState();
  const { classes } = useStyles();

  const fetchTrendingCoins = async () => {
    try {
      const { data } = await axios.get(TrendingCoins(currency));
      setTrending(data);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError("Too many requests - API rate limit exceeded. Please try again later.");
        } else {
          setError(err.message || "An error occurred while fetching trending coins");
        }
      } else {
        setError("An unexpected error occurred");
      }
      setTrending([]);
    }
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    fetchTrendingCoins();
  }, [currency,]);

  if (error) {
    return <div className={classes.error}>{error}</div>;
  }

  return (
    <div className={classes.marqueeContainer}>
      <div className={classes.marqueeContent}>
        {trending.map((coin) => (
          <div key={coin.id}>
            <img src={coin?.image} alt={coin.name} />
            {coin?.symbol.toUpperCase()}&nbsp;
            <span>
              {symbol}
              {coin?.current_price.toLocaleString()}
            </span>
          </div>
        ))}
        {/* Duplicate content for seamless loop */}
        {trending.map((coin) => (
          <div key={`${coin.id}-dup`}>
            <img src={coin?.image} alt={coin.name} />
            {coin?.symbol.toUpperCase()}&nbsp;
            <span>
              {symbol}
              {coin?.current_price.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
    
  );
};

export default Marquee;
