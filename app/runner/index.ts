#!/usr/bin/env ts-node

import { LoaderFunction } from "remix"

let { $, glob } = require('zx')
// import {$} from '..'
export let loader: LoaderFunction = async ({ request, params, context }) => {
    void (async function () {
        await $`echo 'Hello  World!'`
        console.dir(await glob('**/*.ts'))
    })()



}
