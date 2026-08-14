// DOM Elements
const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const loadingDiv = document.getElementById('loading');
const countryInfo = document.getElementById('country-info');
const errorMessage = document.getElementById('error-message');

// API Endpoints (multiple fallbacks)
const APIS = [
    'https://restcountries.com/v3.1/name',
    'https://restcountries.com/v2/name', 
    'https://countriesnow.space/api/v0.1/countries/name'
];

// Fallback: Use local data if all APIs fail
const FALLBACK_DATA = {
    ethiopia: {
        name: { common: 'Ethiopia', official: 'Federal Democratic Republic of Ethiopia' },
        capital: ['Addis Ababa'],
        population: 120000000,
        region: 'Africa',
        subregion: 'Eastern Africa',
        area: 1104300,
        currencies: { ETB: { name: 'Ethiopian Birr', symbol: 'Br' } },
        languages: { am: 'Amharic' },
        timezones: ['UTC+03:00'],
        flags: { svg: 'https://flagcdn.com/w320/et.png', alt: 'Flag of Ethiopia' }
    },
    nigeria: {
        name: { common: 'Nigeria', official: 'Federal Republic of Nigeria' },
        capital: ['Abuja'],
        population: 213000000,
        region: 'Africa',
        subregion: 'Western Africa',
        area: 923768,
        currencies: { NGN: { name: 'Nigerian Naira', symbol: '₦' } },
        languages: { en: 'English' },
        timezones: ['UTC+01:00'],
        flags: { svg: 'https://flagcdn.com/w320/ng.png', alt: 'Flag of Nigeria' }
    },
    kenya: {
        name: { common: 'Kenya', official: 'Republic of Kenya' },
        capital: ['Nairobi'],
        population: 54000000,
        region: 'Africa',
        subregion: 'Eastern Africa',
        area: 580367,
        currencies: { KES: { name: 'Kenyan Shilling', symbol: 'KSh' } },
        languages: { sw: 'Swahili', en: 'English' },
        timezones: ['UTC+03:00'],
        flags: { svg: 'https://flagcdn.com/w320/ke.png', alt: 'Flag of Kenya' }
    },
    ghana: {
        name: { common: 'Ghana', official: 'Republic of Ghana' },
        capital: ['Accra'],
        population: 33000000,
        region: 'Africa',
        subregion: 'Western Africa',
        area: 238535,
        currencies: { GHS: { name: 'Ghanaian Cedi', symbol: '₵' } },
        languages: { en: 'English' },
        timezones: ['UTC+00:00'],
        flags: { svg: 'https://flagcdn.com/w320/gh.png', alt: 'Flag of Ghana' }
    },
    'south africa': {
        name: { common: 'South Africa', official: 'Republic of South Africa' },
        capital: ['Pretoria', 'Cape Town', 'Bloemfontein'],
        population: 60000000,
        region: 'Africa',
        subregion: 'Southern Africa',
        area: 1221037,
        currencies: { ZAR: { name: 'South African Rand', symbol: 'R' } },
        languages: { af: 'Afrikaans', en: 'English', zu: 'Zulu', xh: 'Xhosa' },
        timezones: ['UTC+02:00'],
        flags: { svg: 'https://flagcdn.com/w320/za.png', alt: 'Flag of South Africa' }
    }
};

// Helper functions
function formatPopulation(population) {
    if (!population) return 'N/A';
    return population.toLocaleString();
}

function getCurrencyInfo(country) {
    if (!country.currencies) return 'N/A';
    const currencyCodes = Object.keys(country.currencies);
    const currencyInfo = currencyCodes.map(code => {
        const currency = country.currencies[code];
        return `${currency.name} (${currency.symbol || code})`;
    });
    return currencyInfo.join(', ');
}

function getLanguageInfo(country) {
    if (!country.languages) return 'N/A';
    return Object.values(country.languages).join(', ');
}

function renderCountry(country) {
    const capital = country.capital ? country.capital[0] : 'N/A';
    const population = formatPopulation(country.population);
    const region = country.region || 'N/A';
    const subregion = country.subregion || 'N/A';
    const currencies = getCurrencyInfo(country);
    const languages = getLanguageInfo(country);
    const flag = country.flags ? country.flags.svg : '';
    const flagAlt = country.flags ? country.flags.alt : 'Flag';
    const name = country.name.common;
    const officialName = country.name.official;
    const area = country.area ? formatPopulation(country.area) : 'N/A';
    const timezones = country.timezones ? country.timezones.join(', ') : 'N/A';
    
    countryInfo.innerHTML = `
        <div style="border: 2px solid #333; padding: 20px; border-radius: 10px; max-width: 600px; margin: 20px auto; background: white;">
            ${flag ? `<img src="${flag}" alt="${flagAlt}" style="max-width: 200px; display: block; margin: 0 auto 20px; border: 1px solid #ddd; border-radius: 5px;" />` : ''}
            <h2 style="text-align: center; margin-bottom: 15px;">${name}</h2>
            <p><strong>Official Name:</strong> ${officialName}</p>
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
            <p><strong>Subregion:</strong> ${subregion}</p>
            <p><strong>Area:</strong> ${area} km²</p>
            <p><strong>Currencies:</strong> ${currencies}</p>
            <p><strong>Languages:</strong> ${languages}</p>
            <p><strong>Time Zones:</strong> ${timezones}</p>
        </div>
    `;
}

function showError(message) {
    errorMessage.style.display = 'block';
    errorMessage.textContent = message;
    countryInfo.innerHTML = '';
}

function hideError() {
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';
}

function showLoading() {
    loadingDiv.style.display = 'block';
    loadingDiv.textContent = 'Loading...';
    countryInfo.innerHTML = '';
    hideError();
}

function hideLoading() {
    loadingDiv.style.display = 'none';
}

// Try to fetch from API with timeout
async function fetchWithTimeout(url, options = {}, timeout = 10000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

// Try multiple APIs
async function tryAPIs(countryName) {
    const cleanName = countryName.trim();
    const errors = [];
    
    // Try each API
    for (const api of APIS) {
        try {
            console.log(`Trying API: ${api}/${cleanName}`);
            const res = await fetchWithTimeout(`${api}/${cleanName}`, {}, 5000);
            
            if (res.ok) {
                const data = await res.json();
                console.log(`Success with API: ${api}`);
                
                // Handle different API response formats
                if (Array.isArray(data) && data.length > 0) {
                    return data[0];
                } else if (data && data.data) {
                    // CountriesNow API format
                    return data.data;
                }
            }
        } catch (error) {
            console.log(`API ${api} failed:`, error.message);
            errors.push(`${api}: ${error.message}`);
        }
    }
    
    // Try the all-countries approach
    try {
        console.log('Trying all-countries fallback...');
        const res = await fetchWithTimeout('https://restcountries.com/v3.1/all', {}, 5000);
        if (res.ok) {
            const allCountries = await res.json();
            const country = allCountries.find(c => 
                c.name.common.toLowerCase() === cleanName.toLowerCase() ||
                c.name.official.toLowerCase() === cleanName.toLowerCase() ||
                c.cca2.toLowerCase() === cleanName.toLowerCase() ||
                c.cca3.toLowerCase() === cleanName.toLowerCase()
            );
            if (country) {
                console.log('Found country in all-countries list');
                return country;
            }
        }
    } catch (error) {
        console.log('All-countries fallback failed:', error.message);
        errors.push(`all-countries: ${error.message}`);
    }
    
    // If all APIs fail, use fallback data
    console.log('Using fallback data');
    const fallbackCountry = FALLBACK_DATA[cleanName.toLowerCase()];
    if (fallbackCountry) {
        return fallbackCountry;
    }
    
    throw new Error(`Unable to find country "${cleanName}". ${errors.join('; ')}`);
}

// Main function
async function showCountry(countryName) {
    if (!countryName || countryName.trim() === '') {
        showError('Please enter a country name');
        return;
    }
    
    showLoading();
    
    try {
        const country = await tryAPIs(countryName);
        renderCountry(country);
        hideError();
    } catch (error) {
        showError(`Error: ${error.message}`);
        countryInfo.innerHTML = '';
        console.error('Error:', error);
    } finally {
        hideLoading();
    }
}

// Event Listeners
searchBtn.addEventListener('click', function() {
    const country = countryInput.value.trim();
    if (country) {
        showCountry(country);
    } else {
        showError('Please enter a country name');
    }
});

countryInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Load default country on page load
window.addEventListener('DOMContentLoaded', function() {
    countryInput.value = 'ethiopia';
    showCountry('ethiopia');
});