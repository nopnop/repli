#!/usr/bin/env node
'use strict'
const net = require('net')
const args = process.argv.slice(2)

const C_RESET = '\x1b[0m'
const C_GRAY = '\x1b[90m'
const C_RED = '\x1b[31m'

if (!args.length || ~['-h', '--help'].indexOf(args)) {
  printHelpExit()
}

/**
 * Print help and quit
 */
function printHelpExit () {
  console.log(`Usage: repli [hostname] [port]`)
  process.exit(0)
}

/**
 * Print error and quit
 * @param  {Error} error
 */
function printErrorExit (error) {
  console.error(`${C_RED}[ERROR]${C_RESET}`, error.message)
  process.exit(1)
}

function printInfo (info) {
  console.error(`${C_GRAY}> ${info}${C_RESET}`)
}

// Read options
const options = {
  port: args.length === 1 ? args[0] : args[1],
  host: args.length === 1 ? 'localhost' : args[0]
}

const sock = net.connect(options)

process.stdin.pipe(sock)
sock.pipe(process.stdout)

sock.on('connect', function () {
  process.stdin.resume()
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true)
  }
})

sock.on('close', function done () {
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(false)
  }
  process.stdin.pause()
  sock.removeListener('close', done)
  printInfo(`Session closed by server`)
  sock.destroy()
  process.exit()
})

sock.on('error', printErrorExit)

sock.on('lookup', function (error, address, family) {
  if (error) {
    printErrorExit(error)
  }
  printInfo(`Connect to ip:${address} (IPv${family})`)
})

process.stdin.on('end', function () {
  sock.destroy()
})

process.stdin.on('data', function (b) {
  if (b.length === 1 && b[0] === 4) {
    process.stdin.emit('end')
  }
})
