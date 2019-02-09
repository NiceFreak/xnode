const net = require('net')
const fs = require('fs')

const Request = require('./request')
const { error, log } = require('./utils')

const routeIndex = require('./routes/index')
const routeUser = require('./routes/user')
const routeMessage = require('./routes/message')
const routeTodo = require('./routes/todo')
const routeWeibo = require('./routes/weibo')

const responseFor = (raw, request) => {
    const route = {}
    const routes = Object.assign(route, routeIndex, routeUser, routeMessage, routeTodo, routeWeibo)
    const response = routes[request.path] || error
    const resp = response(request)
    return resp
}

const processRequest = (data, socket) => {
    const raw = data.toString('utf8')
    const request = new Request(raw)
    const ip = socket.localAddress
    log('请求开始')
    log(`ip and request, ${ip}\n${raw}`)
    log('请求结束')
    const response = responseFor(raw, request)
    socket.write(response)
    socket.destroy()
}

const run = (host='', port=3000) => {
    const server = new net.Server()
    server.listen(port, host, () => {
        const address = server.address()
        log(`listening server at http://${address.address}:${address.port}`)
    })

    server.on('connection', (s) => {
        s.on('data', (data) => {
            processRequest(data, s)
        })
    })

    server.on('error', (error) => {
        log('server error', error)
    })

    server.on('close', () => {
        log('server closed')
    })
}

const __main = () => {
    run('0.0.0.0', 5000)
}

if (require.main === module) {
    __main()
}
