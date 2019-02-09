const { log, randomStr } = require('../utils')
const {
    currentUser,
    template,
    loginRequired,
    httpResponse,
    redirect,
} = require('./main')
const session = require('../models/session')

const User = require('../models/user')

const login = (request) => {
    const headers = {}
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.findOne('username', form.username)
        if (u !== null && u.validateAuth(form)) {
            const form = {
                uid: u.id,
            }
            const s = session.encrypt(form)
            headers['Set-Cookie'] = `session=${s}`
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const u = currentUser(request)
    let username
    if (u === null) {
        username = ''
    } else {
        username = u.username
    }
    const body = template('login.html', {
        username: username,
        result: result,
    })
    console.log('httpResponse: ', httpResponse)
    return httpResponse(body, headers)
}

const register = (request) => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.register(form)
        if (u !== null) {
            result = `注册成功`
        } else {
            result = '用户名和密码长度必须大于2或者用户名已经存在'
        }
    } else {
        result = ''
    }
    const us = User.all()
    const body = template('register.html', {
        result: result,
        users: us,
    })
    return httpResponse(body)
}

// react 吹嘘的简单就是下面这一行
// view = f(state)

const profile = (request) => {
    const u = currentUser(request)
    const body = template('profile.html', {
        user: u,
    })
    return httpResponse(body)
}

const routeUser = {
    '/login': login,
    '/register': register,
    '/profile': loginRequired(profile),
}

module.exports = routeUser
