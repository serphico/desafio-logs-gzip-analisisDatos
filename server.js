const httpServer = require('./app.js')
const {processParamas} = require('./config.js')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length;

/*servidor */

if(processParamas.m === 'FORK'){

    const server = httpServer.listen(processParamas.p, () => {
        console.log(`SERVER ON corriento en el puerto: ${processParamas.p}- en MODO: FORK - <b>PID WORKER: ${process.pid}</b>`);
    });
    
    server.on('error', error => { console.log(error)})

}else if(processParamas.m === 'CLUSTER'){
    if(cluster.isMaster){
        console.log(numCPUs);
        console.log(`PID MASTER: ${process.pid}`);

        for (let i = 0; i < numCPUs; i++) {
            cluster.fork()
            
        }

        cluster.on('Worker', worker => {
            console.log(worker.process.pid, 'died', new Date().toLocaleString());
            cluster.fork()
        })

    }else{
        const server = httpServer.listen(processParamas.p, () => {
            console.log(`SERVER ON corriento en el puerto: ${processParamas.p} - en MODO: CLUSTER- <b>PID WORKER: ${process.pid}</b>`);
        });

        server.on('error', error => { console.log(error)})
    }
}else{
    console.log('debe poner en -m FORK o CLUSTER')
}





