const { createApp } = Vue;

createApp({
  data() {
    return {
      user: { name: '', age: '', picture: '' },
      weatherQuery: {
        city: 'London',
        province: 'Ontario',
        country: 'Canada'
      },
      weather: {
        temperature: '',
        wind: '',
        description: ''
      },
      dictionaryQuery: '',
      definition: {
        word: '',
        phonetic: '',
        meaning: ''
      }
    };
  },
  methods: {
    // Only called when user clicks the button
    fetchRandomUser() {
      fetch('https://randomuser.me/api/')
        .then(res => res.json())
        .then(data => {
          const userData = data.results[0];
          this.user.name = `${userData.name.first} ${userData.name.last}`;
          this.user.age = userData.dob.age;
          this.user.picture = userData.picture.large;
        })
        .catch(error => {
          console.error("Random user fetch error:", error);
          this.user.name = 'Unavailable';
          this.user.age = 'N/A';
          this.user.picture = 'https://via.placeholder.com/100';
        });
    },

    fetchWeather() {
      const { city, province, country } = this.weatherQuery;
      const url = `http://comp6062.liamstewart.ca/weather-information?city=${encodeURIComponent(city)}&province=${encodeURIComponent(province)}&country=${encodeURIComponent(country)}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.weather.temperature = data.temperature || 'N/A';
          this.weather.wind = data.wind_speed || 'Wind info not available';
          this.weather.description = data.weather_description || 'Condition not available';
        })
        .catch(error => {
          console.error("Weather fetch error:", error);
          this.weather.temperature = 'Error';
          this.weather.wind = 'Error';
          this.weather.description = 'Unavailable';
        });
    },

    fetchDefinition() {
      fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${this.dictionaryQuery}`)
        .then(res => res.json())
        .then(data => {
          const wordData = data[0];
          this.definition.word = wordData.word;
          this.definition.phonetic = wordData.phonetic || '';
          this.definition.meaning = wordData.meanings[0].definitions[0].definition;
        })
        .catch(error => {
          console.error("Definition fetch error:", error);
          this.definition.word = '';
          this.definition.phonetic = '';
          this.definition.meaning = 'Word not found.';
        });
    }
  },
  mounted() {
    this.fetchWeather(); // Only auto-load weather
  }
}).mount('#app');
