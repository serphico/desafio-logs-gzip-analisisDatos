const { faker } = require('@faker-js/faker');
const idGen = require('../util/idGen.js')

idGen();

function randomProd(id) {
    return {
        id,
        title: faker.commerce.productName(),
        price: faker.commerce.price(),
        thumbnail:faker.image.imageUrl()
    }
    
}



function randomProdGen(cant) {
    cant = 5;
    let prodFinal=[];
    for (let i = 0; i < cant; i++) {
        prodFinal.push(randomProd(idGen()));
        
    }
    return prodFinal
}

module.exports = randomProdGen;
