const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { Console } = require("console");
const dotnev = require("dotenv");
const fs = require("fs");
const { Server } = require("http");
const PROTO_PATH = "./proto/audio.proto";

dotnev.config();

const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const audioProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
server.addService(audioProto.ServicioAudio.service, {descargarAudio : descargarAudioImpl1});

server.bindAsync(`localhost:${process.env.SERVER_PORT}`, grpc.ServerCredentials.createInsecure(),()=>{
    console.log(`Servidor grpc en ejecucion en el puerto: ${process.env.SERVER_PORT}`)
});

function descargarAudioImpl1(call){
    const stream = fs.createReadStream(`./recursos/${call.request.nombre}`, {highWaterMark : 1024});
    console.log(`\n\nEnviando Archivo ${call.request.nombre}`);
    stream.on('data', function (chunk) {
        call.write({datos : chunk});
        process.stdout.write('.');
    }).on('end', function(){
        call.end();
        stream.close();
        console.log('\nEnvio de datos terminado');
    });
}
