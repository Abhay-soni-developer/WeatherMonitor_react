import React, { useState, useEffect } from 'react';
import WatchList from './WatchList'
import CityIntellisense from './CityIntellisense'
import './App.css';


function App() {

  let [watchList, setWatchList] = useState([])

  function getCityLatestData(cityName, cityKey, cb = () => { }) {
    const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${cityKey}?apikey=${process.env.REACT_APP_API_KEY}`
    return fetch(url)
      .then(res => res.json())
      .then(res => {
        res = res[0]
        return { name: cityName, key: cityKey, temp: `${res.Temperature.Value} ${res.Temperature.Unit}` }
        cb({ name: cityName, key: cityKey, temp: `${res.Temperature.Value} ${res.Temperature.Unit}` })
      })
      .catch(err => {
        console.log(err)
        throw err
      })
  }

  function keepFetchingLatestDataForWatchList() {
      return Promise.all(watchList.map(city => getCityLatestData(city.name, city.key)))
        .then(updatedWatchList => {
          return updatedWatchList;
        })
        .catch(err => {
          console.log(err)
        })
  }

  useEffect(()=>{
    console.log('use effect ran')
    let interval = setInterval(() => {
      console.log('polling for new data')
      Boolean(watchList.length) && keepFetchingLatestDataForWatchList()
        .then(updatedList => {
          setWatchList(updatedList)
        })
    }, 5000)

    return ()=>{
      clearInterval(interval)
    }
  }, [watchList.length])

  function addToWatchList(selectedCity) {
    console.log('adding city to watchlist')
    // checking whether the city is already in watchlist or not
    let flag = true;
    for (let i = 0; i < watchList.length; i++) {
      if (watchList[i].key === selectedCity.key) {
        flag = false;
        break;
      }
    }

    if (flag && selectedCity.fromApi) {
      //adding city to watch list if it is not in the list before hand
      let newCity = getCityLatestData(selectedCity.name, selectedCity.key)
      newCity.then(newCityData => {
        setWatchList([...watchList, newCityData])
      }).catch(err=>{
        console.log(err)
      })
    } else {
      console.log('city already exist in list')
    }
  }

  return (
    <div className="App">
      <CityIntellisense onAddButtonClick={addToWatchList}/>
      <WatchList watchList={watchList} />
    </div>
  )
}

export default App;
