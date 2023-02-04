const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config()
const otpGenerator = require('otp-generator')

const User = require('../../model/User');
const Otp = require('../../model/Otp');
const { testTwilio } = require('../../middleWare/sendOtp')

class userController{
    // [get]: /allUser
    home(req,res,next){
        const getUserFromDB = async ()=>{
            try{
                const allUser = await User.find({})
                return res.status(201).json({
                    allUser
                })
            }catch(error){
                next(error)
            }
        }
        getUserFromDB()
    }

    // [post]; /register
    createUser(req,res,next){
        const { username, password, phoneNumber } = req.body
        if(!username || !password || !phoneNumber){
            return res.status(400).json({
                message: 'infomation not enough'
            })
        }
        const createUser = async()=>{
            try{
                const user = await User.findOne({username: username})
                if(user){
                    return res.status(409).json({
                        status: 409,
                        message: "user ton tai"
                    })
                }
                const createUser = {
                    username,
                    password,
                    phoneNumber,
                }
                const otp = otpGenerator.generate(6, {digits: true,lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
                const isChecked = await testTwilio(otp,phoneNumber)
                if(isChecked){
                    const hasdOtp = await bcryt.hash(otp,10);
                    const otpSaveDb = new Otp({
                        phone: phoneNumber,
                        codeOtp: hasdOtp
                    }) 
                    await otpSaveDb.save()
                    res.cookie('createUser',JSON.stringify(createUser),{
                        maxAge: 0.2 * 60 * 60 * 1000,
                        httpOnly: true
                    })
                    res.status(201).json({
                        url: 'http://localhost:5500/apiUser/formOtp'
                    })
                    return;
                }else{
                    res.status(409).json({
                        message: 'infomation invalid',
                    })
                    return;
                }
            }catch(err){
                next(err)
            }
        }
        createUser()
    }

    // [get]: /formOtp
    formOtp(req,res,next){
        res.render("authentication/otp.hbs")
        return;
    }

    // [post]: /verifyOtp
    verifyOtp(req,res,next){
        const { otp } = req.body
        const { username, password, phoneNumber } = JSON.parse(req.cookies?.createUser)
        if(!username || !password || !phoneNumber){
            res.status(401).json({
                message: 'unauthorization',
                retry: true
            })
            return;
        }
        const handleVerifyAndCrUser = async ()=>{
            try{
                const otpFound = await Otp.find({phone: phoneNumber})
                const lengthOtp = otpFound.length
                if(!lengthOtp){
                    res.status(409).json({
                        message: 'otp not found',
                    })
                    return;
                }
                const eleOtpLast = otpFound[lengthOtp - 1]
                const otpCompare = await bcryt.compare(otp,eleOtpLast.codeOtp)
                if(!otpCompare){
                    res.status(401).json({
                        message: "otp invalid",
                        retry: true
                    })
                    return;
                }
                const user = await User.findOne({$and: [
                    { username: username },
                    { phoneNumber: phoneNumber }
                ]})
                if(user){
                    res.status(409).json({
                        message: "user ton tai"
                    })
                    return;
                }
                const hasdPwd = await bcryt.hash(password,10);
                const newUser = {
                    username: username,
                    phoneNumber: phoneNumber,
                    password: hasdPwd,
                    roles: {
                        user: 2001
                    },
                    refreshToken: '',
                }
                const userSave = new User(newUser)
                await userSave.save()
                res.status(200).json({
                    status: 200,
                    message: 'create user succesfull',
                })
            }catch(error){
                next(error)
            }
        }
        handleVerifyAndCrUser()
    }

    // [post]; /signIn
    signIn(req,res,next){
        const { username, password } = req.body
        if(!username || !password){
            return res.status(403).json({
                message: 'username or password dont have'
            })
        }
        
        const checkPwd = async()=>{
            try{
                const user = await User.findOne({username: username})
                if(!user){
                    return res.status(409).json({
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
                    res.cookie('jwt', refreshToken, { maxAge: 24*60*60*1000, httpOnly: true})
                    return res.status(201).json({
                        message: "login succesfully!",
                        username: user.username,
                        accessToken: accessToken,
                        roles: roles,
                        url: 'http://localhost:5500/products/allItem'
                    })
                }

                return res.status(401).json({
                    message: "password khong dung",
                    retry: true,
                })
            }catch(err){
                next(err)
                return;
            }
        }
        checkPwd()
    }

    //[post]: /signOut
    signOut(req,res,next){
        const jwtCookies = req.cookies
        if(!jwtCookies?.jwt){
            res.clearCookie('roles')
            return res.status(401).json({
                message: 'switch page sign In'
            });
        }
        const handleSignOut = async ()=>{
            const refreshToken = jwtCookies.jwt;
            const foundUser = await User.findOne({refreshToken: refreshToken})
            if(!foundUser){
                res.clearCookie('jwt',{httpOnly: true})
                res.clearCookie('roles')
                return res.status(403).json({
                    message: 'switch page sign In / err: forbidden'
                })
            }
            jwt.verify(refreshToken,process.env.REFRESH_KEY_TOKEN,
            async (err,decoded)=>{
                if(err || decoded.userInfo.username !== foundUser.username){
                    res.clearCookie('jwt',{httpOnly: true})
                    res.clearCookie('roles')
                    return res.status(500).json({
                        message: 'switch page sign In'
                    })
                }else{
                    res.clearCookie('roles')
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
    refreshToken(req,res,next){
        const jwtCookie = req.cookies;
        if(!jwtCookie?.jwt){
            return res.status(403).json({
                message: "nen dang nhap lai"
            })
        }
        const handleRefreshToken = async()=>{
            const foundUser = await User.findOne({refreshToken: jwtCookie.jwt})
            if(!foundUser){
                return res.status(403).json({
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
                return res.status(201).json({
                    accessToken,
                })
            })
        }
        handleRefreshToken()
    }

    // [patch]; /update
    updateUser(req,res,next){
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
    deleteUser(req,res,next){
        const id = req.body.id
        if(!id){
            next();
            return;
        }

        const hanldeDeleteUser = async ()=>{
            try{
                const userDeleted = await User.deleteOne({_id: id})
                return res.status(201).json({
                    message: 'succesful'
                })
            }catch(err){
                next(err)
            }
        }
        hanldeDeleteUser()
    }
}

module.exports = new userController()
