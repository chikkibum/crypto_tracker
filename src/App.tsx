// import React from 'react's
import './App.css'
import Header from './components/Header' 
import { makeStyles } from 'tss-react/mui';
import CryptoContext from './context/Context'
import { Outlet } from 'react-router-dom';

const useStyles = makeStyles()((theme) => {
  return {
    app: {
      backgroundColor: '#14161a',
      color: 'white',
      minHeight: '100vh'
    }
  };
});



const App = () => {

  const { classes } = useStyles();


  return (
    <CryptoContext>  
        <div className={classes.app}>
        <Header/>
        <Outlet/>
    </div>
    </CryptoContext>
  )
}

export default App