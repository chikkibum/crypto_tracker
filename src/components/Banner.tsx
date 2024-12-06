import { Container, Typography } from "@mui/material";
import { makeStyles } from "tss-react/mui";
// import Marquee from "./Marquee";

const useStyles = makeStyles()(() => {
  return {
    banner: {
      backgroundImage: "url(https://images.pexels.com/photos/8369648/pexels-photo-8369648.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)",
      opacity: 0.8,
      height: 400,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
    },
    bannerContent: {
      height: 400,
      display: "flex",
      flexDirection: "column",
      paddingTop: 25,
      justifyContent: "space-around",
    },
    tagline: {
      display: "flex",
      height: "40%",
      flexDirection: "column",
      justifyContent: "center",
      textAlign: "center",
    },
  };
});

function Banner() {
  const { classes } = useStyles();

  return (
    <div className={classes.banner}>
      <Container className={classes.bannerContent}>
        <div className={classes.tagline}>
          <Typography
            variant="h2"
            style={{
              fontWeight: "bold",
              marginBottom: 15,
              font: "Gilroy",
              color: "white",
            }}
          >
            Crypto Tracker
          </Typography>
          <Typography
            variant="subtitle2"
            style={{
              color: "darkgrey",
              textTransform: "capitalize",
            //   fontFamily: "Montserrat",
              font: "Gilroy",
              backgroundColor: "black",
              margin: "auto",
              padding: 10,
              borderRadius: 5,
            }}
          >
            Get all the Info regarding your favorite Crypto Currency
          </Typography>
        </div>

      </Container>
     
    </div>
  );
}

export default Banner;
