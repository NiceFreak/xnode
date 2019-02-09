const Model = require('./main')
const User = require('./user')

class Weibo extends Model {
    constructor(form={}, user_id=-1) {
        super()
        this.id = form.id
        this.content = form.content || ''
        // 和别的数据关联的方式, 用 user_id 表明拥有它的 user 实例
        this.user_id = Number(form.user_id || user_id)
    }

    user() {
        const u = User.findOne('id', this.user_id)
        return u
    }

    comments() {
        const Comment = require('./comment')

        const cs = Comment.find('weibo_id', this.id)
        return cs
    }

    static update(form) {
        console.log('update', form)
        const id = Number(form.id)
        const w = this.get(id)
        w.content = form.content
        w.save()
    }
}

const testUpdate = () => {
    const form = {
        content: '睡觉',
        user_id: 1,
        id: 1,
    }
    const w = Weibo.findOne('id', form.id)
    w.content = form.content
    w.save()
}

const testAll = () => {
    const all = Weibo.all()
    console.log(all)
}

const test = () => {
    // testUpdate()
    testAll()
}

if (require.main === module) {
    test()
}

module.exports = Weibo
