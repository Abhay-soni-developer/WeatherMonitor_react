import React, { useState } from 'react';
import './App.css';


export default function CityIntellisense(props) {

    let [selectedCity, setSelectedCity] = useState({ name: '', key: null, fromApi: false })
    let [suggestedCities, setSuggestedCitiesList] = useState([])

    function onCitySearch(e) {
        let searchingText = e.target.value
        setSelectedCity({ name: searchingText, key: '', fromApi: false })
        if (searchingText === '') {
            setSuggestedCitiesList([])
        } else {
            fetchCitiesNameAndSetSuggestedCities(searchingText)
                .then(newSuggestedCities => {
                    setSuggestedCitiesList(newSuggestedCities)
                })
        }
    }

    function fetchCitiesNameAndSetSuggestedCities(searchPhrase) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=${process.env.REACT_APP_API_KEY}&q=${searchPhrase}`
        return fetch(url)
            .then(res => res.json())
            .then(res => {
                return res.map(city => {
                    return { name: city.LocalizedName, key: city.Key }
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    function onSelectingCity(e) {
        //setting fromApi as true , as an indicator that data is from api.
        setSelectedCity({ name: e.target.innerText, key: e.target.getAttribute('data-key'), fromApi: true })
        //clearing suggested citites list
        setSuggestedCitiesList([])
    }

    function onAddButtonClick() {
        props.onAddButtonClick(selectedCity)
        setSelectedCity({ name: '', key: '', fromApi: false })
    }

    return (
        <div className={'city-intellisense'}>
            <input value={selectedCity.name} onChange={onCitySearch} />
            <button onClick={onAddButtonClick}>Add</button>
            {Boolean(suggestedCities.length) && (<div className={'citylist'}>
                {suggestedCities.map((city) => {
                    return <div onClick={onSelectingCity} key={city.key} data-key={city.key}>{city.name}</div>
                })}
            </div>)}
        </div>
    )
}