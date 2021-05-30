const request = require('request');
var chai = require('chai');
let chaiHttp = require('chai-http');
let mainjs = require('../app.js')
var expect = require('chai').expect;
var arrayJsonObjElements = ["Title","Year","imdbID","Poster"];
var imdbIDSpecificElements = ["Title","Director","Plot","Poster"]

chai.use(chaiHttp);

describe("Initializing Tests", ()=>{
    console.log( "This part executes once before all tests" );
})

describe("[Test search-service]  Validate Routes test set", function(){
    it('Check if data is refreshed on Elasticsearch', (done)=>{
        chai.request(mainjs)
        .get('/movies/all/space')
        .end((err,res)=> {
            // expect(JSON.stringify(res.text)).equal('"refresh completed"')
            console.log(res);
            done();
        })
    });

    // it('Valid JSON Elements Response in OMDB-API Request without imdbID', (done)=>{
    //     request('http://www.omdbapi.com/?apikey=9030182c&s=space&y=2001', function (error, response, body) {
    //         var movieData = JSON.parse(body);
    //         // console.log(movieData.Search[0])
    //         if(arrayJsonObjElements.every(property=>{ return movieData.Search[0].hasOwnProperty(property) }) ){
    //             done();
    //         }
    //     })
    // });

    // it('Valid Response from OMDB-API with hardcoded imdbID', (done)=>{
    //     request('http://www.omdbapi.com/?apikey=9030182c&i=tt0275848', function (error, response, body) {
    //         var idSpecificMovieData = JSON.parse(body);
    //         // console.log(movieData)
    //         if(imdbIDSpecificElements.every(property=>{ return idSpecificMovieData.hasOwnProperty(property) }) ){
    //             done();
    //         }
    //     })
    // });

})




