const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const dotnev = require("dotenv");
const PROTO_PATH = "./proto/audio.proto";
const portAudio = require('naudiodon');

dotnev.config();


const packageDefinition = protoLoader.loadSync(PROTO_PATH);
const audioProto = grpc.loadPackageDefinition(packageDefinition);

const stub = new audioProto.ServicioAudio(`localhost:${process.env.SERVER_PORT}`, grpc.credentials.createInsecure());
nombre_archivo = "anyma.wav";
streamAudio(stub, nombre_archivo);


function streamAudio(stub, nombre_archivo) {
    var ao = new portAudio.AudioIO({
        outOptions: {
            channelCount: 2,
            sampleFormat: portAudio.SampleFormat16Bit,
            sampleRate: 48000
        }
    });
    ao.start();
    console.log(`\nReproduciendo el archivo: ${nombre_archivo}`);

    stub.descargarAudio({
        nombre: nombre_archivo
    }).on('data', (RespuestaChunkAudio) => {
        process.stdout.write('.');
        ao.write(RespuestaChunkAudio.datos);
    }).on('end', function() {
        console.log(`\nTerminó la recepción`);
    });
}
