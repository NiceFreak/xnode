const fs = require('fs')

const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

const load = (path) => {
    const options = {
        encoding: 'utf8',
    }
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}

class Model {
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = require('path')
        const filename = `${classname}.json`
        const p = path.join(__dirname, '../db', filename)
        return p
    }

    static _newFromDict(dict) {
        const cls = this
        const m = new cls(dict)
        return m
    }

    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map((m) => {
            const cls = this
            const instance = cls._newFromDict(m)
            return instance
        })
        return ms
    }

    static create(form={}) {
        const cls = this
        const instance = new cls(form)
        instance.save()
        // save 之后, 微博的数据就已经在数据库中了
        return instance
    }

    static findOne(key, value) {
        const all = this.all()
        let m = all.find((e) => {
            return e[key] === value
        })

        if (m === undefined) {
            m = null
        }

        return m
    }

    static find(key, value) {
        const all = this.all()
        const models = all.filter((m) => {
            return m[key] === value
        })
        return models
    }

    static get(id) {
        return this.findOne('id', id)
    }

    save() {
        const cls = this.constructor
        const models = cls.all()
        if (this.id === undefined) {
            if (models.length > 0) {
                const last = models[models.length - 1]
                this.id = last.id + 1
            } else {
                this.id = 1
            }
            models.push(this)
        } else {
            const index = models.findIndex((e) => {
                return e.id === this.id
            })
            if (index > -1) {
                models[index] = this
            }
        }
        const path = cls.dbPath()
        save(models, path)
    }

    static remove(id) {
        const cls = this
        const models = cls.all()
        const index = models.findIndex((e) => {
            return e.id === id
        })
        if (index > -1) {
            models.splice(index, 1)
        }
        const path = cls.dbPath()
        save(models, path)
        return
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

module.exports = Model
