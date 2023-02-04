const dotenv = require('dotenv')
dotenv.config()
const accountSid = process.env.SID_TWILIO;
const authToken = process.env.TOKEN_SERCET_TWILIO;
const client = require('twilio')(accountSid, authToken);

const testTwilio = async (otp = false,phoneNumber = '0399158631')=>{
    try{
        const result = await client.messages.create({
           body: `OTP is ${otp}`,
           from: '+17577808352',
           to: `+84${phoneNumber}`
        })
        return result ? 1 : 0;
    }catch(err){
        if(err){
            return 0
        }
    }
}

module.exports = {
    testTwilio
}