const fsPromise = require('fs').promises;
const fs = require('fs');
const path = require('path')

const eventLogger = async(message,obj)=>{
    const datastring = `${message}\t ${obj.name}\t ${obj.address}\n`
    try{
        if(!fs.existsSync(path.join(__dirname,'emitEvent','logger.text'))){
            await fsPromise.mkdir(path.join(__dirname,'emitEvent'))
        }

        // test
        await fsPromise.appendFile(path.join(__dirname,'emitEvent','logger.text'),datastring)
    }catch(err){
        console.log(err)
    }
}
// test

module.exports = eventLogger
