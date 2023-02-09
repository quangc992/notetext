const mongoose = require('mongoose')
mongoose.set('strictQuery', true)
require('dotenv').config({ path: 'local.env' })

async function connect() {
    try {
        // Connect to MongoDB
        mongoose.connect(process.env.CONNECTMONGODB, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
            .then(() => console.log('✔✔✔'))
            .catch(err => console.log('🛠🛠🛠 : ' + err))
    } catch (error) {
        console.log('🛠🛠🛠 : connect db error')
        console.log(error)
    }
}
module.exports = { connect }