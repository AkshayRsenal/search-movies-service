const { Client } = require('@elastic/elasticsearch')
const request = require('request');
const express = require('express')
const app = express()
const config = require('config');
const elasticConfig = config.get('elastic');
const port = process.env.PORT || 5000

// place in src with index.js no need to import anywhere
const proxy = require('http-proxy-middleware')

module.exports = function(app) {
    // add other server routes to path array
    app.use(proxy(['/','/movies/:category/:keywords' ], { target: 'http://localhost:5000' }));
}

app.use(function(req, res, next) {
    
//to allow cross domain requests to send cookie information.
res.header('Access-Control-Allow-Credentials', true);

// origin can not be '*' when crendentials are enabled. so need to set it to the request origin
res.header('Access-Control-Allow-Origin',  req.headers.origin);

// list of methods that are supported by the server
res.header('Access-Control-Allow-Methods','OPTIONS,GET,PUT,POST,DELETE');

res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, X-XSRF-TOKEN');

    next();
});

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
        size: 200,
        body: {
            query: elasticSearchObject
        }
    })
    return body.hits.hits
}
// read().catch(console.log)


app.listen(port, () => {
    console.log(`Example app listening at ${port}`)
})

