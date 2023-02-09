const cron = require('cron')

const content = require('../module/content/content')

class CronController {
    autoDelContentExpire = async () => {
        try {
            const datas = await content.find({})
            for (const data of datas) {
                if (data.createdAt >= data.timeExpire) {
                    await content.findOneAndDelete({ _id: data._id })
                        .then(() => console.log(`Xóa dữ liệu có id: ${data._id} vì hết hạn`))
                        .catch(error => console.error(`Lỗi xóa dữ liệu có id: ${data._id}`, error))
                }
            }
        } catch (error) {
            console.error(error)
        }
    }
    startCronJob() {
        // tự động chạy lệnh mỗi ngày vào 1h sáng mỗi ngày
        const job = new cron.CronJob('0 0 * * 1', this.autoDelContentExpire)
        job.start()
    }
}

module.exports = new CronController()
