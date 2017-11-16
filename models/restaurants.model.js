let RestaurantsModel = {}

RestaurantsModel.read = (options1, options2) => {
    return global.rt.find(options1, options2).toArray()
}

RestaurantsModel.addRestaurant = (restaurantToAdd, reject) => {
    return new Promise((resolve, reject) => {
        global.rt.find({
            name: restaurantToAdd.name
        }).limit(1).toArray((err, data) => {
            resolve(data)
        })
    }).then((data) => {
        if (data.length > 0) return reject('duplicate restaurant name')
        return global.rt.count()
    }).then((count) => {
        restaurantToAdd['restaurant_id'] = count + 1
        return global.rt.insert(restaurantToAdd)
    })
}

RestaurantsModel.editRestaurant = (options1, options2, owner) => {
    return new Promise((resolve, reject) => {
        global.rt.find(options1).limit(1).toArray((err, data) => {
            resolve(data)
        })
    }).then((data) => {
        if (data[0].owner != owner) throw ('No Permission')
        const docToUpdate = { ...data[0],
            ...options2
        }
        return global.rt.update(options1, docToUpdate, {
            upsert: true
        })
    })
}

RestaurantsModel.rateRestaurant = (options1, options2, owner) => {
    return new Promise((resolve, reject) => {
        resolve()
    }).then(() => {
        return global.rt.update(options1, options2)
    })
}

RestaurantsModel.removeRestaurant = (id, owner) => {
    return new Promise((resolve, reject) => {
        global.rt.find({
            _id: id
        }).limit(1).toArray((err, data) =>
            resolve(data)
        )
    }).then((data) => {
        console.log(data)
        if (data[0].owner != owner) throw ('No Permission')
        return global.rt.remove({
            _id: id
        })
    })
}

export default RestaurantsModel