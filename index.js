const ethers = require('ethers')

let required_fields = ['private_key', 'rpc', 'to', 'count']
let { data, private_key, rpc, to, count, value } = process.env

for(let k of required_fields) {
    const env = process.env

    if(env[k]) {
        continue
    }

    console.error(`missing environment variable ${k}`)
    process.exit(1)
}

data = data || '0x'
value = value || 0

function hexify(s) {
    if(s.startsWith('0x'))
        return s
    return '0x' + s
}

async function main() {
    const input = {
        data, private_key, rpc, to, count
    }
    console.log(`recieved inputs = `)
    console.log(input)
    const provider = new ethers.providers.JsonRpcProvider(rpc)
    const signer = new ethers.Wallet(private_key, provider)
    const n = await signer.getTransactionCount()
    console.log(`nonce of ${signer.address} = ${n}`) 
    const waits = [] 
    let now = new Date()
    console.log(`before sending ${count} transactions now = ${now.valueOf() / 1000}`)
    for(let i = 0; i < count; i++) {
        const w = signer.sendTransaction({
            to: hexify(to),
            data: hexify(data),
            nonce: n + i,
            value: hexify(value)
        })

        waits.push(w)
    }

    for(let w of waits) {
        let resp  = await w
        await resp.wait() 
    }
    now = new Date()
    console.log(`after confirmed ${count} transactions now = ${now.valueOf() / 1000}`)
}


main().catch(err => {
    console.error(err)
    process.exit(1)
})
