const {desnormalizar, normalizar} = require('../util/desnormalizar.js')
const util = require('util')

function print(obj) {
    console.log(util.inspect(obj,false,12,true))
    
}



class FbChat{
    constructor(collection){
        this.collection = collection;
    }

    async read(){
        try {
            let querySnapshot = await this.collection.get();
            let prodObj = querySnapshot.docs;
            const response = prodObj.map( (res) => ({
                result: res.data().result,
                entities: res.data().entities
            }))
            return response;
        } catch (error) {
            console.log(error)
        }
    }

    async save(obj){
                let querySnapshot = await this.collection.get();
                let prodObj = querySnapshot.docs;
                const response = prodObj.map( (res) => ({
                    result: res.data().result,
                    entities: res.data().entities
                }))
                console.log(response.length);
                if (response.length <= 0) {
                    let newObj = {
                        id: "mensajes",
                        author:[obj.author],
                        text:[obj.text]
                    }
                    console.log(newObj)

                    const newDataNormalizada= normalizar(newObj)


                   await this.collection.doc('mensaje').set(newDataNormalizada)
                } else if (response.length > 0) {
                    const dataDesnormalizada = desnormalizar(response[0].result, response[0].entities)
                    console.log(dataDesnormalizada)


                    dataDesnormalizada.author.push(obj.author);
                    dataDesnormalizada.text.push(obj.text);
                    console.log(dataDesnormalizada)
                    const newDataNormalizada= normalizar(dataDesnormalizada)


                    await this.collection.doc('mensaje').update(newDataNormalizada)
                }

    }
    
}

module.exports = FbChat;