var chai = require('chai');
let chaiHttp = require('chai-http');
let mainjs = require('../app.js')
var expect = require('chai').expect;
chai.use(chaiHttp);

describe("Initializing Tests", ()=>{
    console.log( "This part executes once before all tests" );
})

describe("[Test search-service]  Validate /movies/all/space end point", function(){
    it('Check if route /movies/:category/:keywords returns matches', (done)=>{
        chai.request(mainjs)
        .get('/movies/all/space')
        .end((err,res)=> {
            expect(JSON.parse(res.text)[0]).to.deep.include({
                _source: {
                    title: '2001: A Space Road Odyssey',
                    director: 'N/A',
                    plot: 'Natasha & Steve (the voice of Space) hit the road traveling accross Canada searching for the paranormal.',
                    poster: 'N/A'
                }
                });
            expect(JSON.parse(res.text)[0]).to.deep.include({
                _index: 'movie_database',
                _type: '_doc',
                _id: 'tt0288910',
                });
            done();
        })
    });
})


