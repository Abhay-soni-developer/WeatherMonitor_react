import React from 'react';
import './App.css';


export default function WatchList({watchList}) {
    return (
        <div className={'watchList'}>
        <div style={{ backgroundColor: 'cyan' }}>
          <div>CITY NAME</div>
          <div>CITY TEMPERATURE</div>
        </div>
        {watchList.map(cityWeatherData => {
          console.log('list data' ,watchList)
          return (
            <div key={cityWeatherData.name} data-key={cityWeatherData.key}>
              <div>{cityWeatherData.name}</div>
              <div>{cityWeatherData.temp}</div>
            </div>
          )
        })}
      </div>
    )
}