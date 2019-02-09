const Model = require('./main')

class Message extends Model {
    constructor(form) {
        super()
        this.author = form.author || ''
        this.message = form.message || ''
    }
}

module.exports = Message