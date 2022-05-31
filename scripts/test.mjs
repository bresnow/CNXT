#!/usr/bin/env zx
import 'zx/globals';

let bear = await question('What kind of bear is best? ')
let token = await question('Choose env variable: ', {
    choices: Object.keys(process.env)
})

console.log(`${bear} is the best bear!`)
console.log(`${token} is the best token!`)