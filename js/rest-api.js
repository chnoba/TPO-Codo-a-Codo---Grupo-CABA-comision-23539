const BASE_URL = 'https://countriesnow.space/api/v0.1/countries'
let listaPaises = document.querySelector('#listaPaises')

let getCountries = async () => {
  let data = await fetch(BASE_URL).then(response => response.json())
  const countries = data.data
  countries.forEach((country) => {
    let option = document.createElement("option")
    option.appendChild(document.createTextNode(`${country.country}`))
    listaPaises.appendChild(option)
  })


}
getCountries()