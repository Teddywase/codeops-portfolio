# Country Facts Page

A single-page application that fetches and displays country information from the REST Countries API.

## Features

- Search for any country by name
- Display capital, population, region, currencies, and flag
- Shows loading state during API requests
- Handles errors gracefully (country not found, network errors)
- Defaults to Ethiopia on first load
- Clean, responsive UI

## How to Use

1. Open `index.html` in your browser
2. Enter a country name in the search box
3. Click "Search" or press Enter
4. View the country's facts

## Technologies Used

- HTML
- CSS
- JavaScript (ES6+)
- REST Countries API (https://restcountries.com)

## API Used

- **REST Countries API**: https://restcountries.com/v3.1/name/{country}
- Returns JSON data with country information

## What I Learned

- Making API requests with `fetch()`
- Using `async/await` for asynchronous operations
- Handling errors with `try/catch`
- Checking `res.ok` for HTTP errors
- DOM manipulation with vanilla JavaScript
- Managing loading, success, and error states
- Working with nested JSON data

## API Response Fields Used

| Field | Description |
|-------|-------------|
| `name.common` | Common country name |
| `name.official` | Official country name |
| `capital[0]` | Capital city |
| `population` | Population number |
| `region` | Geographic region |
| `subregion` | Geographic subregion |
| `area` | Area in km² |
| `currencies` | Currency information |
| `languages` | Languages spoken |
| `timezones` | Time zones |
| `flags.svg` | SVG flag URL |

## File Structure
