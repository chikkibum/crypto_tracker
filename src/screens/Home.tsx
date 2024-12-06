import React from 'react'
import Banner from '../components/Banner'
import Crypto_data from '../components/Crypto_data'
import Marquee from '../components/Marquee'
const Home = () => {
  return (
    <div>
      <Banner/> 
      <Marquee/>
      <Crypto_data/>
    </div>
  )
}

export default Home