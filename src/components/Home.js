import React from 'react'
import AllStocks from './AllStocks'
import StocksForEachUser from './StocksForEachUser'
import './Home.css'

function Home() {
  return (
    <div className='home'>
        <AllStocks/>
        <StocksForEachUser/>
    </div>
  )
}

export default Home