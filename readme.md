# repli

Minimalist REPL client for node

## Installation

```shell
npm install -g repli
```

## Usage

1. Create a repl server somewhere in you application (see `exemples/server.js`):
  ```javascript
  'use strict'
  const repl = require('repl')
  const net = require('net')

  net.createServer((socket) => {
    socket.write('Welcome\n')

    let replServer = repl.start({
      prompt: '> ',
      input: socket,
      output: socket,
      terminal: true,
      useGlobal: false
    })

    replServer.on('exit', () => socket.end())

    replServer.context.actions = {
      sayHello (who) {
        console.log('Hello %s !', who || 'World')
        socket.write('(Done)\n')
      }
    }

  }).listen(4242)
  ```

2. Then use repli to use it:
  ```sh
  repli localhost 4242
  > Connect to ip:127.0.0.1 (IPv4)
  Welcome
  > action.sayHello('Foobar')
  (Done)
  undefined
  > _
  ```


## Credit

Based on [TooTallNate gist](https://gist.github.com/TooTallNate/2209310)

---

[The MIT License](./LICENSE)
