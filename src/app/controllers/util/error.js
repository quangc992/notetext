const { format } = require("date-fns")
const fs = require('fs').promises
const path = require('path')

module.exports = {
    returnError500: async function (res, message, error) {
        const fileName = path.join(__dirname, '../../logs', 'error500.log')
        const contentLog = `\n\n${format(new Date(), 'dd-MM-yyyy ss:mm:HH')}
        \n${'message => ' + message}
        \n${'error => ' + error}`
        fs.appendFile(fileName, contentLog)
        console.error(error)

        return res.status(500).json({
            status: message
        })
    },
    returnError400: async function (res, message, error) {
        
        return
    },
}