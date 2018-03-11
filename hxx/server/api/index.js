const login = require('./login')
const article = require('./article')
const draft = require('./draft.js')
const tag = require('./tag.js')
const comment = require('./comment')
const user = require('./user')

module.exports = (app) => {
    app.use(login)
    app.use(article)
    app.use(draft)
    app.use(tag)
    app.use(comment)
    app.use(user)
}
