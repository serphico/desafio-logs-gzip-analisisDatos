const mongoose = require('mongoose');

const {Schema} = require('mongoose')


const productSchemaName = 'users';

const userSchema = new Schema({
    email: {type: String, required: true, max: 100},
    username: {type: String, required: true, max: 100},
    password: {type: String, required: true, max:100}
});

const Users = mongoose.model(productSchemaName,userSchema);

module.exports = Users;