const { normalize, denormalize, schema } = require('normalizr')


function desnormalizar(result, entities) {
    const author = new schema.Entity('author', {}, { idAttribute: 'email' });
    const text = new schema.Entity('text', { author: author },{ idAttribute: 'id' });
    const messagesCenter = new schema.Entity('messagesCenter', {

      authors: [author],
      messages: [text]
    }, { idAttribute: 'id' });
    
    const denormalizeData= denormalize(result, messagesCenter, entities);

    return denormalizeData
}

function normalizar(obj) {
    const author = new schema.Entity('author', {}, { idAttribute: 'email' });
    const text = new schema.Entity('text', { author: author },{ idAttribute: 'id' });
    const messagesCenter = new schema.Entity('messagesCenter', {

      authors: [author],
      messages: [text]
    }, { idAttribute: 'id' });
    
    const normalizeData= normalize(obj, messagesCenter);

    return normalizeData
}

module.exports = {desnormalizar, normalizar};