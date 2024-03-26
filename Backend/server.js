const express = require('express')
const app = express()

app.get('/',(req,res)=>{
    res.send('Wassup')
})
app.get('/tickets',(req,res)=>{
    res.send('Viewing available tickets')
})

app.listen(3000, () => {
    console.log('Running on port 3000')
})