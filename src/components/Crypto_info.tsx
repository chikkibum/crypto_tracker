import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { HistoricalChart } from "../api/api";
import { Line } from "react-chartjs-2";
import {
  CircularProgress,
  ThemeProvider,
  createTheme,
  useMediaQuery,
  useTheme,
  Typography
} from "@mui/material";
import styled from "@emotion/styled";
import SelectButton from "./SelectButton";
import { chartDays } from "../api/data";
import { CryptoState } from "../context/Context";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CoinInfoProps {
  coin: {
    id: string;
  };
}

const Container = styled.div<{isMobile: boolean}>`
  width: ${props => props.isMobile ? "100%" : "75%"};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: ${props => props.isMobile ? 0 : "25px"};
  padding: ${props => props.isMobile ? "20px" : "40px"};
  padding-top: ${props => props.isMobile && 0};
`;

const ButtonContainer = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-around;
  width: 100%;
`;

const CoinInfo = ({ coin }: CoinInfoProps) => {
  const [historicData, setHistoricData] = useState<number[][]>();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();
  const [flag, setFlag] = useState(false);
  const chartRef = useRef<ChartJS | null>(null);
  const [error, setError] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchHistoricData = async () => {
    try {
      const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
      setFlag(true);
      setHistoricData(data.prices);
      setError(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError("Too many requests - API rate limit exceeded. Please try again later.");
        } else {
          setError(err.message || "An error occurred loading chart data");
        }
      }
    }
  };

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    fetchHistoricData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <Container isMobile={isMobile}>
        {error ? (
          <Typography color="error" variant="h6" align="center">
            {error}
          </Typography>
        ) : !historicData || flag === false ? (
          <CircularProgress style={{ color: "gold" }} size={250} thickness={1} />
        ) : (
          <>
            <Line
              ref={chartRef}
              data={{
                labels: historicData.map((coin) => {
                  const date = new Date(coin[0]);
                  const time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;
                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "orange",
                  },
                ],
              }}
              options={{
                responsive: true,
                elements: {
                  point: {
                    radius: 1,
                  },
                },
                scales: {
                  x: {
                    display: true,
                  },
                  y: {
                    display: true
                  }
                }
              }}
            />
            <ButtonContainer>
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => {
                    setDays(day.value);
                    setFlag(false);
                  }}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </ButtonContainer>
          </>
        )}
      </Container>
    </ThemeProvider>
  );
};

export default CoinInfo;