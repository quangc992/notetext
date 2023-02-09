
const bcrypt = require('bcrypt')

module.exports = {
    bcryptCompare: async function (passwordDB, password) {
        const isMatch = await bcrypt.compare(password, passwordDB);
        return isMatch
    },
}