module.exports = {
    Query: {
        getListing: (_, {city}, {dataSources}) => dataSources.retsAPI.getPropertiesByCity({city})
    }
}