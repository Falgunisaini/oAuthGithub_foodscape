const express = require('express');
const app = express();
const superagent = require('superagent');
const request = require('request');
const dotenv=require('dotenv')
dotenv.config();
const port = process.env.PORT || 9900;
const cors = require('cors');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use(cors())

//static file path
app.use(express.static(__dirname+'/public'))
//html
app.set('views','./src/views');
//view engine
app.set('view engine','ejs');

app.get('/',(req,res) => {
    res.render('index');
});

app.post('/oauth',(req,res) => {
    superagent
    .post('https://github.com/login/oauth/access_token')
    .send({
        client_id:'e142ac826f134c8bf347',
        client_secret:'1978fd1058c32155c32c5e4a696558f6c57e3bb8',
        code:req.body.code
    })
    .set('Accept','application/json')
    .end((err,result) => {
        if(err) throw err;
        var accesstoken = result.body.access_token
        const option = {
            url:'https://api.github.com/user',
            method:'GET',
            headers:{
                'Accept':'application/json',
                'Authorization':'token '+accesstoken,
                'User-Agent':'sep-node'
            }
        }
        var output;
        request(option,(err,response,body) => {
            output = body;
            console.log(output)
            return res.send(output)
        })
    })
})

app.listen(port,() => {
    console.log(`Server is running on port ${port}`)
})
