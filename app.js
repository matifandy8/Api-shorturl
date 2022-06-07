const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const validUrl = require('valid-url');
const models = require('./models');
const router = express.Router();
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

router.get('/', (req,res) => {
    // send homepage
    res.sendFile(__dirname + '/views/index.html');
});

router.get('/:url', async (req,res) => {
    // decode and redirect url
    try {
        let url = await models.findURL(req.params.url);
        if(url !== null) {
            res.redirect(url);
        } else {
            res.send('invalid/expired URL');            
        }
    }
    catch(e) {
        console.log(e);
        res.send('invalid/expired URL');
    }
});

router.post('/api/short', async (req,res) => {
    if(validUrl.isUri(req.body.url)) {
        // valid URL        
        try {
            let hash = await models.storeURL(req.body.url);
            res.send(req.hostname + '/' +hash);
        }
        catch(e) {
            console.log(e);
            res.send('error occurred while storing URL.');
        }
    } else {
        res.send('invalid URL');
    }
});

app.use('/', router);

app.listen(process.env.PORT || 3000);
console.log(`App is listening at ${process.env.PORT || 3000}`);