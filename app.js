const { Client } = require('@elastic/elasticsearch')
const config = require('config');
const request = require('request');
const elasticConfig = config.get('elastic');
const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const client = new Client({
    cloud: {
        id: elasticConfig.cloudID
    },
    auth: {
        username: elasticConfig.username,
        password: elasticConfig.password
    }
})

app.get('/', (req, res) => {
    res.send('finished landing')
})

app.get('/movies/:category/:keywords', (req, res) => {
    let results = read(req.params.category, req.params.keywords);
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
        size: 2,
        body: {
            query: elasticSearchObject/*  {
                match: { category: keywords }
            } */
        }
    })
    return body.hits.hits
}
// read().catch(console.log)


app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})

