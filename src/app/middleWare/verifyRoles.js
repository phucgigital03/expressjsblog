
const verifyRoles = (...allowRoles)=>{
    return (req,res,next)=>{
        if(!req?.roles){
            return res.status(401).json({
                message: "Unauthorization! Ko co roles"
            })
        }
        const rolesArray = [...allowRoles]
        const isConditionRoles = req.roles.filter(role => rolesArray.includes(role))
        if(isConditionRoles.length === 0){
            return res.status(401).json({
                message: "Unauthorization! ko macth roles"
            })
        }
        next()
    }
}

module.exports = verifyRoles
