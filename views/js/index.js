
let socket = io().connect();


socket.on('messages', (data) => {
    chat(data);
})


function chat(data){
    const author = new normalizr.schema.Entity('author', {}, { idAttribute: 'email' });
    const text = new normalizr.schema.Entity('text', { author: author },{ idAttribute: 'id' });
    const messagesCenter = new normalizr.schema.Entity('messagesCenter', {

      authors: [author],
      messages: [text]
    }, { idAttribute: 'id' });

 
    const denormalizeData= [normalizr.denormalize(data[0].result, messagesCenter, data[0].entities)];

    const longO = JSON.stringify(denormalizeData).length;
    console.log("longitud Original es de:"+ longO)
    const longNor = JSON.stringify(data).length;
    console.log("longitud normalizado es de:"+ longNor)
    const porcentaje = (longNor * 100) / longO;
    console.log("porcentaje de compresión es de:"+ porcentaje.toFixed(2) + "%")

    document.getElementById('porcentaje').innerHTML = `Centro de Mensaje. (Compresión: ${porcentaje}%`;

    let authorsDesnorm = denormalizeData[0].author;
    let textDesnorm = denormalizeData[0].text;
    console.log(textDesnorm)

    const authorsMap = authorsDesnorm.map((elem, index) => {
        return (`<div>
        <p style="font-style:italic; color: green;">
            <strong style="font-style: normal; color:blue;">${elem.alias}</strong>
            <span style="font-style: normal; color:brown;">${elem.email}</span>
            ${textDesnorm[index]}
            <img width="50" src="${elem.avatar}"/>
        </p>
    </div>`)
    }).join("")
    document.getElementById('allChat').innerHTML = authorsMap;

}

function addMessage(e){
    let chatFormat = {
        id:"mensajes",
        author:{
            email:document.getElementById('email').value,
            nombre:document.getElementById('name').value,
            apellido:document.getElementById('surname').value,
            edad:document.getElementById('age').value,
            alias:document.getElementById('nick').value,
            avatar:document.getElementById('avatar').value
        },

        text: document.getElementById('mensaje').value     

    }
    socket.emit('new-messages', chatFormat)
    document.getElementById('mensaje').value = '';
    document.getElementById('enviar').focus();

    return false;
}