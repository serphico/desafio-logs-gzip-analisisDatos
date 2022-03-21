const FbChat = require('../data/schemaProd.js')
const {queryChat} = require('../config.js')

class Chat extends FbChat{
    constructor(){
        super(queryChat)
    }

    async readChat(){
        try {
            let coso = await this.read();
            return coso
        } catch (error) {
            console.log(error)
        }
    }

    async saveChat(obj){
        try {
            this.save(obj)
        } catch (error) {
            console.log(error)
        }
    }

}

const chatCt = new Chat();

module.exports = chatCt;