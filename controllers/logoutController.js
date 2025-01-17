const usersDB ={
    users: require('../model/users.json'),
    setUsers: function(data) {this.users = data}
}

const fsPromises = require("fs").promises;
const path = require('path');

const handleLogout =async(req,res)=>{
    //on clients , also delete the accessToken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;

    //is refresh token in DB

    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken)

    if(!foundUser){
        res.clearCookie('jwt',{httpOnly: true,sameSite:'None',secure:true,},{maxAge:"24*60*60*1000"})
        return res.sendStatus(204);
    }
    //Delete refresh token in db
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)

    const currentUser ={...foundUser, refreshToken:''};
    usersDB.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
        path.join(__dirname,'..','model','users.json'),
        JSON.stringify(usersDB.us)
    )
    res.clearCookie('jwt', {httpOnly:true},{maxAge:"24*60*60*1000"}) //secure: true--> only serves on https

    res.sendStatus(204);

} 

module.exports = {handleLogout}