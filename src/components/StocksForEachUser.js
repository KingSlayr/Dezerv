import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { POLY_API_KEY } from '../config';


const dummyExchangeThreshold = 150;
const dummyUsers = [
  {
    name:'User_1',
    stocks:[{
        "ticker": "A",
        "name": "Agilent Technologies Inc.",
        "market": "stocks",
        "locale": "us",
        "primary_exchange": "XNYS",
        "type": "CS",
        "active": true,
        "currency_name": "usd",
        "cik": "0001090872",
        "composite_figi": "BBG000C2V3D6",
        "share_class_figi": "BBG001SCTQY4",
        "last_updated_utc": "2023-12-04T00:00:00Z"
    },
    {
        "ticker": "AA",
        "name": "Alcoa Corporation",
        "market": "stocks",
        "locale": "us",
        "primary_exchange": "XNYS",
        "type": "CS",
        "active": true,
        "currency_name": "usd",
        "cik": "0001675149",
        "composite_figi": "BBG00B3T3HD3",
        "share_class_figi": "BBG00B3T3HF1",
        "last_updated_utc": "2023-12-04T00:00:00Z"
    },
    {
        "ticker": "AAA",
        "name": "AXS First Priority CLO Bond ETF",
        "market": "stocks",
        "locale": "us",
        "primary_exchange": "ARCX",
        "type": "ETF",
        "active": true,
        "currency_name": "usd",
        "cik": "0001776878",
        "composite_figi": "BBG01B0JRCS6",
        "share_class_figi": "BBG01B0JRCT5",
        "last_updated_utc": "2023-12-04T00:00:00Z"
    },
    {
        "ticker": "AAAIF",
        "name": "ALTERNATIVE INVSTMENT TR",
        "market": "otc",
        "locale": "us",
        "type": "FUND",
        "active": true,
        "currency_name": "USD",
        "last_updated_utc": "2022-08-26T05:00:07.114Z"
    },
    {
        "ticker": "AAALY",
        "name": "AAREAL BANK AG UNSP/ADR",
        "market": "otc",
        "locale": "us",
        "type": "ADRC",
        "active": true,
        "currency_name": "USD",
        "composite_figi": "BBG002628DF1",
        "share_class_figi": "BBG002628F57",
        "last_updated_utc": "2023-05-04T05:00:29.876Z"
    },
    {
        "ticker": "AAAU",
        "name": "Goldman Sachs Physical Gold ETF Shares",
        "market": "stocks",
        "locale": "us",
        "primary_exchange": "BATS",
        "type": "ETF",
        "active": true,
        "currency_name": "usd",
        "cik": "0001708646",
        "composite_figi": "BBG00LPXX872",
        "share_class_figi": "BBG00LPXX8Z1",
        "last_updated_utc": "2023-12-04T00:00:00Z"
    },
    {
        "ticker": "AABB",
        "name": "ASIA BROADBAND INC",
        "market": "otc",
        "locale": "us",
        "type": "CS",
        "active": true,
        "currency_name": "USD",
        "composite_figi": "BBG000CWNRN5",
        "share_class_figi": "BBG001SGRBK5",
        "last_updated_utc": "2023-04-17T05:00:24.252Z"
    },
    {
        "ticker": "AABVF",
        "name": "ABERDEEN INTL INC",
        "market": "otc",
        "locale": "us",
        "type": "OS",
        "active": true,
        "currency_name": "USD",
        "composite_figi": "BBG000BXKHJ4",
        "share_class_figi": "BBG001S6XZ90",
        "last_updated_utc": "2023-05-10T05:00:36.305Z"
    },
    {
        "ticker": "AACAF",
        "name": "AAC TECHS HLDGS INC ORD",
        "market": "otc",
        "locale": "us",
        "type": "OS",
        "active": true,
        "currency_name": "USD",
        "last_updated_utc": "2022-06-24T14:14:05.429Z"
    },
    {
        "ticker": "AACAY",
        "name": "AAC TECHS HLDGS UNSP/ADR",
        "market": "otc",
        "locale": "us",
        "type": "ADRC",
        "active": true,
        "currency_name": "USD",
        "composite_figi": "BBG000VNTB62",
        "share_class_figi": "BBG001T3PT80",
        "last_updated_utc": "2023-04-14T05:00:16.614Z"
    },
    {
        "ticker": "AACG",
        "name": "ATA Creativity Global American Depositary Shares",
        "market": "stocks",
        "locale": "us",
        "primary_exchange": "XNAS",
        "type": "ADRC",
        "active": true,
        "currency_name": "usd",
        "cik": "0001420529",
        "composite_figi": "BBG000V2S3P6",
        "share_class_figi": "BBG001T125S9",
        "last_updated_utc": "2023-12-04T00:00:00Z"
    }]
  }
]

function StocksForEachUser() {
  const [UsersUnderPerformingStocks, setUsersUnderPerformingStocks] = useState({})
  const fetchDataForStock = async (username,stock) => {
    try {
      const smaURL = `https://api.polygon.io/v1/indicators/sma/${stock.ticker}?timespan=day&adjusted=true&window=50&series_type=close&order=desc`;
      const headers= {
        'Authorization': `Bearer ${POLY_API_KEY}`,
        'Content-Type': 'application/json',
      }
      const response = await axios.get(smaURL, { headers });
      if(response?.data?.results?.values.length>0&&response?.data?.results?.values[0].value<dummyExchangeThreshold){
        setUsersUnderPerformingStocks((prev)=>{
          if(prev[username]&&prev[username].length>0){
            const containsValue = prev[username].some(obj => obj.ticker === stock.ticker);
            if(!containsValue){
              return {
                ...prev,
                [username]:[...prev[username],stock]
              };
            }else{
              return {
                ...prev
              }
            }
          }else{
            return {
              ...prev,
              [username]:[stock]
            };
          }
        })
      }
    } catch (error) {
      console.error(`Error fetching data for ${stock.ticker}:`, error.message);
    }
  };
  
  const fetchUserData = async () => {
    try {
      for (const user of dummyUsers) {
        for (const stock of user.stocks) {
          await fetchDataForStock(user.name,stock);
          await new Promise(resolve => setTimeout(resolve, 60000));
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [])
  
  return (
    <div className='section'>
        <h3>Underperforimg Stocks for each User</h3>
        {Object.keys(UsersUnderPerformingStocks).map((userKey) => (
        <div key={userKey}>
          <p className='title'>{userKey}</p>
          <ul>
            {UsersUnderPerformingStocks[userKey].map((item) => (
              <li key={item.ticker}>{item.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default StocksForEachUser