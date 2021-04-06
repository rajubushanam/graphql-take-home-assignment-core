const { createTestClient } = require('apollo-server-testing');
const {typeDefs} = require('../index')
const resolvers = require('../resolvers')
const RETSAPI = require('../datasources/RETSAPI')
const {ApolloServer, gql} = require('apollo-server-express')

const GET_LISTING_BY_CITY = gql`
query getListing($city: String!) {
    getListing(city: $city) {
      favoriteCount
      privateRemarks
      property {
        roof
        cooling
        style
      }
    }
  }
`;

const GET_LISTING_BY_CITY_NOROOF = gql`
query getListing($city: String!) {
    getListing(city: $city) {
      favoriteCount
      privateRemarks
      property {
        cooling
        style
      }
    }
  }
`;

const testServer = ({context}) => {
    return new ApolloServer({
        typeDefs,
        resolvers,
        dataSources: () => ({
            retsAPI: new RETSAPI()
        }),
        context: context
      });
}


describe("Queries", () => {
    it("should contain a field 'roof' in the response", async () => {
    const server = testServer({
        context: () => ({userName: 'test@side.com'})
    })
    const {query} = createTestClient(server);
    const res = await query({query: GET_LISTING_BY_CITY, variables: {city: "Houston"}});
    const propertyObj = res.data.getListing[0].property
    expect(propertyObj).toMatchObject({'roof': 'Tile'})
    })

    it("should not contain a field 'roof' in the response", async () => {
        const server = testServer({
            context: () => ({userName: 'test@side.com'})
        })
        const {query} = createTestClient(server);
        const res = await query({query: GET_LISTING_BY_CITY_NOROOF, variables: {city: "Houston"}});
        const propertyObj = res.data.getListing[0].property
        expect(propertyObj['roof']).toBe(undefined)
        })
})
