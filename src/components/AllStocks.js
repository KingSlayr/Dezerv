import React, { useEffect, useState } from 'react'
import { POLY_API_KEY } from '../config';
import axios from 'axios';

const exchangeUrl = 'https://api.polygon.io/v3/reference/exchanges?asset_class=stocks'
const baseStocksUrl = 'https://api.polygon.io/v3/reference/tickers?active=true'

const dummyExchangeThreshold = 150;

function AllStocks() {
    // Axios GET request with Bearer token authentication
    const [exchanges, setexchanges] = useState([])
    const [selectedExchange, setselectedExchange] = useState("XNYS")
    const [stockList, setstockList] = useState([])
    const [underperforingStocks, setunderperforingStocks] = useState([])

    useEffect(() => {
        axios.get(exchangeUrl, {
            headers: {
            'Authorization': `Bearer ${POLY_API_KEY}`,
            'Content-Type': 'application/json',
            },
        })
        .then(response => {
            const exchangeObjects = response.data.results.filter(exchange => exchange.type === 'exchange');
            setexchanges(exchangeObjects);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [])

    useEffect(() => {
        if(selectedExchange.length===0)return;
        const url = baseStocksUrl + '&exchange=' + selectedExchange;
        axios.get(url, {
            headers: {
            'Authorization': `Bearer ${POLY_API_KEY}`,
            'Content-Type': 'application/json',
            },
        })
        .then(response => {
            setstockList(response.data.results)
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }, [selectedExchange])

    useEffect(() => {
        fetchWithDelay(stockList);
    }, [stockList])

    const fetchWithDelay = async (stocks) => {
        for (const stock of stocks) {
            try {
                const smaURL = `https://api.polygon.io/v1/indicators/sma/${stock.ticker}?timespan=day&adjusted=true&window=50&series_type=close&order=desc`
                const headers= {
                    'Authorization': `Bearer ${POLY_API_KEY}`,
                    'Content-Type': 'application/json',
                }
                const response = await axios.get(smaURL,{headers});
                if(response?.data?.results?.values.length>0){
                    if(response?.data?.results?.values[0].value<dummyExchangeThreshold){
                        const containsValue = underperforingStocks.some(obj => obj.ticker === stock.ticker);
                        if(!containsValue){
                            let updatedStockesList = underperforingStocks;
                            updatedStockesList.push(stock);
                            setunderperforingStocks([...updatedStockesList]);
                        }
                    }
                }
            } catch (error) {
                console.error("Error : ",error)
            }
            await new Promise(resolve => setTimeout(resolve, 60000));
        }
    };

    const handleSelectChange = (event) => {
        setselectedExchange(event.target.value);
    };
    
  return (
    <div className='section'>
        <h3>All Underperforimg Stocks</h3>
        <form>
            <label htmlFor="options">Select exchange:</label>
            <select value={selectedExchange} id="options" name="options" onChange={handleSelectChange}>
                {exchanges.map(option => (
                    <option key={option.mic} value={option.mic}>{option.name}</option>
                ))}
            </select>
        </form>
        <ul>
            {underperforingStocks.map(option => (
                   <li key={option.ticker}>{option?.name}</li>
            ))}
        </ul>
    </div>
  )
}

export default AllStocks