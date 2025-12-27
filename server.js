const express = require('express');
const exphbs = require('express-handlebars');

const app = express();
app.engine('handlebars', exphbs.engine({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
const port = process.env.PORT || 3000;
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/about', (req, res)=>{
    res.render('about');
});

app.get('/contact', (req, res)=>{
    res.render('contact');
});

app.listen(port ,()=>{
    console.log(`port is running on ${port}`);
});