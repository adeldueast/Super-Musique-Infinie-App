let express = require('express')
let app =  express();

app.use(express.static(__dirname+'/dist/super-musique-infinie'));

app.get('/*',(req,res)=>{
    res.sendFile(__dirname+'/dist/super-musique-infinie/index.html')
})

app.listen(process.env.PORT || 8080);