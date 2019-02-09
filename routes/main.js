const nunjucks = require('nunjucks')
const crypto = require('crypto')

const fs = require('fs')
const { log } = require('../utils')
const User = require('../models/user')
const session = require('../models/session')

const loader = new nunjucks.FileSystemLoader('templates', {
    noCache: true,
})

const env = new nunjucks.Environment(loader)

const currentUser = (request) => {
    const s = request.cookies.session || ''
    if (s.length > 0) {
        const r = session.decrypt(s)
        const uid = r.uid
        const u = User.findOne('id', uid)
        return u
    } else {
        return null
    }
}

const template = (path, data) => {
    const s = env.render(path, data)
    return s
}

const headerFromMapper = (mapper={}, code=200) => {
    let base = `HTTP/1.1 ${code} OK\r\n`
    const keys = Object.keys(mapper)
    const s = keys.map((k) => {
        const v = mapper[k]
        const h = `${k}: ${v}\r\n`
        return h
    }).join('')

    const header = base + s
    return header
}

const httpResponse = (body, headers=null) => {
    let mapper = {
        'Content-Type': 'text/html',
    }
    if (headers !== null) {
        mapper = Object.assign(mapper, headers)
    }
    const header = headerFromMapper(mapper)
    const r = header + '\r\n' + body
    return r
}

const static = (request) => {
    // 静态资源的处理
    const raw = request.query.file.split('/')
    const type = raw[0]
    const filename = raw[1]
    const path = `../static/${type}/${filename}`
    const body = fs.readFileSync(path)
    const header = headerFromMapper()
    const h = Buffer.from(header + '\r\n')
    const r = Buffer.concat([h, body])
    return r
}

const redirect = (url) => {
    const headers = {
        Location: url,
    }
    const header = headerFromMapper(headers, 302)
    const r=  header + '\r\n' + ''
    return r
}

const loginRequired = (routeFunc) => {
    const func = (request) => {
        const u = currentUser(request)
        if (u === null) {
            return redirect('/login')
        } else {
            return routeFunc(request)
        }
    }
    return func
}

module.exports = {
    currentUser: currentUser,
    template: template,
    headerFromMapper: headerFromMapper,
    static: static,
    redirect: redirect,
    loginRequired: loginRequired,
    httpResponse: httpResponse,
}
