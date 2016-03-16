/**
 * Run this script (node exemple/server.js)
 * Then use repli to connect to this server:
 *
 * > repli localhost 4242
 *
 * More information on how to define actions, context, etc.:
 * https://nodejs.org/api/repl.html
 */

'use strict'
const repl = require('repl')
const net = require('net')

const CRESET = '\x1b[0m'
const CBLUE = '\x1b[34m'

net.createServer((socket) => {
  socket.write(`${CBLUE}Welcome${CRESET}\n`)
  let replServer = repl.start({
    prompt: `${CBLUE}\u2234 ${CRESET}`,
    input: socket,
    output: socket,
    terminal: true,
    useGlobal: false
  })

  socket.on('error', function (error) {
    console.log('error', error)
  })

  replServer.on('exit', () => {
    socket.end()
  })

  replServer.context.actions = {
    sayHello (who) {
      console.log('Hello %s !', who || 'World')
      socket.write('(Done)\n')
    }
  }
}).listen(4242, function () {
  console.log('Server ready: repli localhost 4242')
})
