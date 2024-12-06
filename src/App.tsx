// import React from 'react's
import './App.css'
import { BrowserRouter, Routes } from 'react-router'
import Header from './components/Header' 
import Home from './screens/Home'
import cryptoPage from './screens/cryptoPage'
import { makeStyles } from 'tss-react/mui';
import { Outlet } from 'react-router-dom';
import CryptoContext from './context/Context'

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
    // <BrowserRouter>
    <CryptoContext>  
        <div className={classes.app}>
        <Header/>
        {/* <Route path='/' Component={Home}/>
        <Route path='/crypto/:id' Component={cryptoPage}/> */}
        <Outlet/>
    </div>
    </CryptoContext>
    // </BrowserRouter>

  )
}

export default App