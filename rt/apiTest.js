const axios = require('axios').default;

axios.get('http://localhost:3000/serialize')
.then(function (response) {
    // handle success
    console.log(response.data);
})
.catch(function (error) {
    // handle error
    console.log(error);
});


axios.get('http://localhost:3000/logger')
.then(function (response) {
    console.log(response.data);
})
.catch(function (error) {
    console.log(error);
});