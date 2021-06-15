const { Client } = require('@elastic/elasticsearch')
const config = require('config');
const request = require('request');
const elasticConfig = config.get('elastic');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

const client = new Client({
    cloud: {
        id: process.env.elasticCloudId
    },
    auth: {
        username: process.env.elasticUser,
        password: process.env.elasticPassword
    }
})


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.get('/', (req, res) => {
    res.send('finished landing')
})

app.get('/movies/:category/:keywords', (req, res) => {
    let results = read(req.params.category, req.params.keywords);
    results.then(X => res.send(JSON.stringify(X)))
})

app.get('/all-media-resources', (req, res) => {
    let results = read("all-media-resources", keywords="");
    results.then(X => res.send(JSON.stringify(X)))
})

app.get('/refresh', (req, res) => {
    res.send('refresh completed')
})



async function read(category, keywords) {
    if (category === 'all') {
        var elasticSearchObject = {
            query_string: {
                query: keywords
            }
        }
    } else if( category === 'all-media-resources' ) { 
        var elasticSearchObject = {
            "match_all": {}
        }
    } else {
        var Initialobject = {}
        Initialobject[category] = keywords
        var elasticSearchObject = {
            match: Initialobject
        }
        console.log(elasticSearchObject);
    }

    const { body } = await client.search({
        index: 'movie_database',
        size: 200,
        // size: 5,
        body: {
            query: elasticSearchObject
        }
    })

    // body.hits.total.value

    // return body.hits
    return body.hits.hits
}
// read().catch(console.log)


app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})

module.exports = app;  // for testing purpose
