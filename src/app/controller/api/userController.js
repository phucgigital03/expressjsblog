const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()

const User = require('../../model/User');

class userController{
    // [get]: /
    home(req,res){
        res.json(stateUser.users)
    }

    // [post]; /register
    createUser(req,res){
        const { username, password } = req.body
        if(!username || !password){
            return res.status(400).json({
                message: 'username or password dont have'
            })
        }
        
        const createUser = async()=>{
            try{
                const user = await User.findOne({username: username})
                if(user){
                    return res.status(409).json({
                        message: "user ton tai"
                    })
                }
                const hasdPwd = await bcryt.hash(password,10);
                const newUser = {
                    username: username,
                    password: hasdPwd,
                    roles: {
                        user: 2001
                    },
                    refreshToken: '',
                }
                const userSave = new User(newUser)
                await userSave.save()
                res.status(200).json({
                    message: 'create user succesfull'
                })
            }catch(err){
                console.log(err)
                res.status(500).json({
                    message: "error of server"
                })
            }
        }
        createUser()
    }

    // [post]; /signIn
    signIn(req,res){
        const { username, password } = req.body
        if(!username || !password){
            return res.status(400).json({
                message: 'username or password dont have'
            })
        }
        
        const checkPwd = async()=>{
            try{
                const user = await User.findOne({username: username})
                if(!user){
                    return res.json({
                        message: "user khong ton tai"
                    })
                }

                const passwordCompare = await bcryt.compare(password,user.password)
                if(passwordCompare){
                    const roles = Object.values(user.roles)
                    const accessToken = jwt.sign(
                        {
                            userInfo: {
                                username: user.username,
                                roles: roles 
                            }
                        },
                        process.env.ACCESS_KEY_TOKEN,
                        {
                            expiresIn: '60s'
                        }
                    )
                    const refreshToken = jwt.sign(
                        {
                            userInfo: {
                                username: user.username,
                            }
                        },
                        process.env.REFRESH_KEY_TOKEN,
                        {
                            expiresIn: '1d'
                        }
                    )
                    await User.updateOne({username: username},{refreshToken: refreshToken})
                    res.cookie('jwt', refreshToken, { httpOnly: true ,maxAge: 24*60*60*1000})
                    return res.status(201).json({
                        message: "login succesfully!",
                        username: user.username,
                        accessToken: accessToken,
                        roles: roles,
                    })
                }
                return res.json({
                    message: "password khong dung"
                })
            }catch(err){
                console.log(err)
                res.status(500).json({
                    message: "loi server"
                })
            }
        }
        checkPwd()
    }

    //[post]: /signOut
    signOut(req,res){
        const jwtCookies = req.cookies
        if(!jwtCookies?.jwt){
            return res.status(204).send("switch page sign In");
        }

        const handleSignOut = async ()=>{
            const refreshToken = jwtCookies.jwt;
            const foundUser = await User.findOne({refreshToken: refreshToken})
            if(!foundUser){
                res.clearCookie('jwt',{httpOnly: true})
                return res.status(403).json({
                    message: 'switch page sign In / err: forbidden'
                })
            }
            jwt.verify(refreshToken,process.env.REFRESH_KEY_TOKEN,
            async (err,decoded)=>{
                if(err || decoded.userInfo.username !== foundUser.username){
                    res.clearCookie('jwt',{httpOnly: true})
                    return res.status(500).json({
                        message: 'switch page sign In'
                    })
                }else{
                    res.clearCookie('jwt',{httpOnly: true})
                    await User.updateOne({username: foundUser.username},{refreshToken: ""});
                    return res.status(201).json({
                        message: 'signOut success'
                    })
                }
            })
        }
        handleSignOut()
    }

    // [get]; /refreshToken
    refreshToken(req,res){
        const jwtCookie = req.cookies;
        if(!jwtCookie?.jwt){
            return res.status(401).json({
                message: "nen dang nhap lai"
            })
        }
        const handleRefreshToken = async()=>{
            const foundUser = await User.findOne({refreshToken: jwtCookie.jwt})
            if(!foundUser){
                return res.status(401).json({
                    message: "ko match refreshToken"
                })
            }
            jwt.verify(jwtCookie.jwt,process.env.REFRESH_KEY_TOKEN,(err,decodeed)=>{
                if(err || decodeed.userInfo.username !== foundUser.username){
                    return res.status(500).json({
                        message: "nen dang nhap lai"
                    })
                }
                const accessToken = jwt.sign(
                    {
                        userInfo:{
                            username: decodeed.userInfo.username,
                            roles: Object.values(foundUser.roles)
                        }
                    },
                    process.env.ACCESS_KEY_TOKEN,
                    {
                        expiresIn: '60s'
                    }
                )
                res.status(201).json({
                    accessToken,
                })
            })
        }
        handleRefreshToken()
    }

    // [patch]; /update
    updateUser(req,res){
        const {username, password, passwordNew} = req.body
        if(!username || !password || !passwordNew){
            return res.status(401).json({
                message: "loi client: username password passwordNew required"
            })
        }

        const handleEditPwd = async()=>{
            try{
                const foundUser = await User.findOne({username: username})
                if(!foundUser){
                    return res.status(409).json({
                        message: "user no exist"
                    })
                }
                
                const compare = await bcryt.compare(password,foundUser.password)
                if(compare){
                    const passHash = await bcryt.hash(passwordNew,10);
                    await User.updateOne({username: foundUser.username},{password: passHash})
                    return res.status(201).json({
                        message: "doi mat khau thanh cong"
                    })
                }
                return res.status(401).json({
                    message: "password cu khong dung"
                })

            }catch(error){
                console.log(error.message)
                return res.status(500).json({
                    message: "loi server"
                })
            }
        }
        handleEditPwd()
    }

    // [delete]; /delete
    deleteUser(req,res){
        res.json({
            message: "delete user"
        })
    }
}

module.exports = new userController()
