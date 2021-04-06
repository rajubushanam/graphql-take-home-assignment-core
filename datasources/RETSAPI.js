const {RESTDataSource} = require('apollo-datasource-rest')
require('dotenv').config()

class RETSAPI extends RESTDataSource {
    constructor() {
        super()
        this.baseURL='https://api.simplyrets.com'
    }

    //Setting the auth token header to every request going to RETSAPI
    willSendRequest(request) {
        const encodeCredentials = Buffer.from(`${process.env.RETSAPI_USERNAME}:${process.env.RETSAPI_PASSWORD}`).toString('base64')
        const token = `Basic ${encodeCredentials}`
        request.headers.set('Authorization', token);
    }

    async getPropertiesByCity({city}) {
        const results = await this.get(`/properties?q=${city}`)
        return results
    }
}

module.exports = RETSAPI