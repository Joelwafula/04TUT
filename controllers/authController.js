const usersDB ={
    users: require('../model/users.json'),
    setUsers: function(data) {this.users = data}
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path')

const handleLogin = async(req,res)=>{
    const {user,pwd} = req.body;
    if (!user || !pwd) return res.status(400).json({'message':'Username and password are required'})

    const foundUser = usersDB.users.find(person => person.username ===user);

    if(!foundUser) return res.sendStatus(401);//unauthorized
     //evaluate password
    const match = await bcrypt.compare(pwd,foundUser.password)

    if(match){
        //create JWTs 
        //here we pass payload as username not password in order to enhance the security
        const accessToken = jwt.sign(
            {"username":foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'30s'}

        );

        const refreshToken = jwt.sign(
            {"username":foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'1d'}
        );
        //saving refreshToken with curent user

        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = {...foundUser, refreshToken};
        usersDB.setUsers([...otherUsers,currentUser]);

        await fsPromises.writeFile(
            path.join(__dirname,'..','model','users.json'),
            JSON.stringify(usersDB.users)
        );

        res.cookie('jwt',refreshToken,{httpOnly:true,sameSite:'None',secure:true, maxAge:24*60*60*1000})
//http only is not available to js
     res.json({ accessToken });
     //frontend dev can grab this acces token
     //access token should be stored in memory

    }else{
        res.sendStatus(401)
    }
}

module.exports ={handleLogin}

// const handleLogin =async(req,res)=>{
//     const {user,pwd} = req.body;
//     if(!user || !pwd) return res.status(400).json({'Message':'username and password required'})
//     //duplicate users
// const foundUser = usersDB.users.find(person => person.username === user)
// if(foundUser) return res.sendStatus(401)

// }
