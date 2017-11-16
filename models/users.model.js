let UsersModel = {}

UsersModel.read=(options1)=>{
    return global.user.find(options1).toArray()
}

UsersModel.add=(options1,reject)=>{
    return new Promise((resolve, reject) => {
        global.user.find({
            username: options1.username
        }).limit(1).toArray((err,data)=>{
            resolve(data)
        })
    }).then((data) => {
        if (data.length > 0) throw ('duplicate user')
        return global.user.insert(options1)        
    })
}

export default UsersModel