1. Cafe Management System - Signup API of User & Backend Structure(Angular, Node.js, MySQL Database) --> 17:30

For resolve this error when you start the server. 
--> Error: ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; consider upgrading MySQL client
    at Sequence._packetToError (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\protocol\sequences\Sequence.js:47:14)
    at Handshake.ErrorPacket (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\protocol\sequences\Handshake.js:123:18)
    at Protocol._parsePacket (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\protocol\Protocol.js:291:23)
    at Parser._parsePacket (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\protocol\Parser.js:433:10)
    at Parser.write (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\protocol\Parser.js:43:10)
    at Protocol.write (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\protocol\Protocol.js:38:16)
    at Socket.<anonymous> (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\Connection.js:88:28)
    at Socket.<anonymous> (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\Connection.js:526:10)
    at Socket.emit (node:events:518:28)
    at addChunk (node:internal/streams/readable:559:12)
    --------------------
    at Protocol._enqueue (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\protocol\Protocol.js:144:48)
    at Protocol.handshake (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\protocol\Protocol.js:51:23)
    at Connection.connect (C:\Users\33778\Desktop\ProjetFullStack\node_modules\mysql\lib\Connection.js:116:18)
    at Object.<anonymous> (C:\Users\33778\Desktop\ProjetFullStack\connections.js:12:12)
    at Module._compile (node:internal/modules/cjs/loader:1376:14)
    at Module._extensions..js (node:internal/modules/cjs/loader:1435:10)
    at Module.load (node:internal/modules/cjs/loader:1207:32)
    at Module._load (node:internal/modules/cjs/loader:1023:12)
    at Module.require (node:internal/modules/cjs/loader:1235:19)
    at require (node:internal/modules/helpers:176:18) {
  code: 'ER_NOT_SUPPORTED_AUTH_MODE',
  errno: 1251,
  sqlMessage: 'Client does not support authentication protocol requested by server; consider upgrading MySQL client',
  sqlState: '08004',
  fatal: true
}


inside mysql console : ALTER USER 'your user name'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your password';