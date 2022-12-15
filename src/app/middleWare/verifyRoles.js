
const verifyRoles = (...allowRoles)=>{
    return (req,res,next)=>{
        if(!req?.roles){
            return res.status(401).json({
                message: "Unauthorization!"
            })
        }
        const rolesArray = [...allowRoles]
        const isConditionRoles = req.roles.filter(role => rolesArray.includes(role))
        if(isConditionRoles.length === 0){
            return res.status(401).json({
                message: "Unauthorization!"
            })
        }
        next()
    }
}

module.exports = verifyRoles
