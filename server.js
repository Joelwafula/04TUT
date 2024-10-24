const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 3500;
const app = express();
const errorHandler = require("./middleware/errorHandler.js")
const verifyJWT = require('./middleware/verifyJWT.js');
//third party
const cookieParser = require('cookie-parser')
const corsOptions = require('./config/corsOptions.js')
const cors = require('cors')
const {logger} = require('./middleware/logEvents.js')
//cross origin resourse sharing
// const whitelist = ['https://www.google.com',"http://127.0.0.1:5500","http://localhost:3500"]

// const corsOptions ={
//     origin: (origin,callback)=>{
//         if(whitelist.indexOf(origin) !== -1 || !origin){
//             callback(null, true)
//         } else{
//             callback(new Error("Not allowed by CORS"))
//         }

//     },
//     optionsSuccessStatus: 200
// }
app.use(cors(corsOptions))
//middleware
//custom middleware logger
app.use(logger)
//the built in middlewares do not need next because they are already built in
//built in,c ustom third party

//use when form data is submitted
app.use(express.urlencoded({extended:false}))

//built in middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser)
//serve static files
app.use("/",express.static(path.join(__dirname,"./public")))
//to supply also the subdir file with css  we do this
app.use('/subdir', express.static(path.join(__dirname,'/public')))

app.use('^/', require('./routes/root'))
//we now use the route from the routes folder using router
app.use('/subdir', require('./routes/subdir'))
app.use('/auth',require('./routes/auth.js'))
app.use('/register', require('./routes/register.js'));
app.use('/refresh', require('./routes/refresh.js'))
app.use('/logout', require('./routes/logout.js'))
app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))


//transferring these files to the routes

// app.get('^/$|/index(.html)?', (req,res)=>{
//     // res.sendFile('./views/index.html',{root:__dirname})
//     res.sendFile(path.join(__dirname,"views","index.html"))

// });

// app.get('/new-page(.html)?', (req,res)=>{
//     // res.sendFile('./views/index.html',{root:__dirname})
//     res.sendFile(path.join(__dirname,"views","new-page.html"))})


//  app.get('/old-page(.html)?', (req,res)=>{
//         // res.sendFile('./views/index.html',{root:__dirname})
//   res.redirect(301,'/new-page.html')} //302 by default
//  )


//this /* shows that anything follows after the /
//app.use() does not accept regex, here we use 
//  app.get('/*' ,(req,res)=>{
//     res.status(404).sendFile(path.join(__dirname,"views","404.html"))

//  })
app.all('*' ,(req,res)=>{
    res.status(404);
    if(req.accepted('html')){

        res.sendFile(path.join(__dirname,"views","404.html"))
    }
   else if(req.accepted('json')){

        res.json(path.join({error:"404 Not Found"}))
    } else{
        res.type('txt').send("404 not found ")
    }

 })

 //chaining route handlers

 app.get('/hello', (req,res,next)=>{
    console.log("Attempted to load hello.html")
    next()
 },(req,res)=>{
    res.send("Hello world");
 })

 //using a built in error handler tohandle all theerrors

 app.use(errorHandler)
    
app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`))
