const fs = require('fs')

const formattedTime = () => {
    const d = new Date()
    // 这里需要注意, js 中 month 是从 0 开始计算的, 所以要加 1
    const month = d.getMonth() + 1
    const date = d.getDate()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const seconds = d.getSeconds()

    const t = `${hours}:${minutes}:${seconds}`
    return t
}

const log = (...args) => {
    const t = formattedTime()
    const arg = [t].concat(args)
    console.log.apply(console, arg)

    const content = t + ' ' + args + '\n'
    fs.writeFileSync('log.txt', content, {
        flag: 'a',
    })
}

const randomStr = () => {
    const seed = '1234567890qwertyuiopasdfghjklzxcvbnm'
    let s = ''
    for (let i = 0; i < 16; i++) {
        const random = Math.random() * (seed.length - 1)
        const index = Math.floor(random)
        s += seed[index]
    }
    return s
}

const error = (request=null, code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[code] || ''
    return r
}

// 单独使用一个 key, 用来加密 session
const key = 'node7'

module.exports.log = log
module.exports.randomStr = randomStr
module.exports.key = key
module.exports.error = error
