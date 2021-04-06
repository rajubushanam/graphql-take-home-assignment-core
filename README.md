Please read the PLEASE_READ_FIRST.md first.

Please document your code & design decisions here.

# Summary
I have been using Graphql very recently so I had to spend some time to do research and read documentation on apollo docs. I was able to figure out few minute things like how to call outside Rest calls from inside the graphql server. But overall it was a good experience building the graphql server from scratch.

# Libraries
1. graphql - library to use graphql inside our project
2. apollo-graphql-express - library to handle express integrated with graphql server. We arent using any REST APIs from the client in this project, but this can help us add REST capability to the server along with graphql.
3. apollo-datasource-rest - library to handle any REST calls to outside integrations.
4. dotenv - library to allow exposing the environment variable to the process.env global variable.
5. express - library to use express server.
6. jest - test library suite to run unit test cases.
7. apollo-server-testing - test library to run graphql test cases.

# Folder Structure
Made this folder structure to make it easy to organize future implementations, forked your project and did few changes.
1. datasources - folder where all the files related to data integration are placed. Whether it is with third party
or DB, all concerns are handled here. We have RETSAPI class to handle all RETSAPI calls.
2. resolvers - folder that contains an index file which includes all the code related to resolvers.
3. types - folders that includes all types supported by the Graphql server.
4. .env - file that includes all environment variables, this will be usually excluded in the git. For this project case I pushed it to git so you can have access.
5. index.js - contains the entry point server code.

# How to run the project
1. Git clone the project from the URL provided (git@github.com:rajubushanam/graphql-take-home-assignment-core.git)
2. Open terminal and navigate to the root of the folder.
3. Enter 'npm i' to install all the libraries locally.
4. Now to run the graphql server, enter 'npm run start' in the command line. This should start the server with a message as 'GraphQL server listening on http://localhost:4000/graphql'.
5. Now open a browser tab and navigate to http://localhost:4000/graphql address. You should see a Playground to test the apollo server.
6. Run the following query on the left side and hit play icon.
Make sure to include the header as: 
{
  "Authorization": "Basic dXNlcjFAc2lkZWluYy5jb206Njc2Y2ZkMzQtZTcwNi00Y2NlLTg3Y2EtOTdmOTQ3YzQzYmQ0"
}

query {
  getListing(city: "Houston") {
    favoriteCount
    privateRemarks
    property {
      roof
      cooling
      style
    }
  }
}

This should give back a list of listings for the city Houston with the fields mentioned in the query. You can change this city value to any city in US to get new results.


# Explanation of the project
As the folder structure explains the reasons behind how the data flow happens we will look into more details below:

1. ApolloServer which was imported from apollo-server-express is started by passing the type definitions, resolvers and dataSources.
2. type definitions are being created using the gql function imported from apollo-server-express. types schema is defined inside the types/index.js file. Created a Query type with name as getListing and it has a mandatory argument called city. So this city is the city passed from the client to get listings based on a city.
3. dataSources return an object called retsAPI which is a function that instantiates new RETSAPI class. We will use this retsAPI later in the resolvers to call the third party API.
4. resolvers has just one resolver with name as getListing, the first argument is parent (not used here), second argument is args (we are destructuring for city), third argument is context (destructuring dataSources which is passed in during ApolloServer creation). dataSources will give us access to retsAPI which in turn gives us access to RETSAPI function getPropertiesByCity(). Inside getPropertiesByCity() function we handle the REST API call to RETSAPI to get all properties based on the city.
5. RETSAPI class extends from RESTDataSource which was imported from apollo-datasource-rest library. This allows us to have access to REST API calls like GET,POST,PUT,DELETE. We defined the baseURL inside the constructor so we can have access to it through 'this' class scope. Using willSendRequest function we are setting the auth header for every outgoing request from this class to RETSAPI.
6. We are using the context in ApolloServer options to handle the logic to check if a user is authenticated to have access to our graphql server. We are using Bearer Authentication here as mentioned in the requirements. We decode the token in base64 to ascii format and then check if the userName exists. We also check for specific userName 'user1@side.com' as we are hard coding one user, we do not have any DB to check against. We throw an auth error if userName doesnt exist or doesnt match to the client. If we were using JWT token to handle the authentication we would generate a token with a login endpoint that can be utilized for each request. In our case we are assuming that the token was already generated, I took the username:password format and base64 encoded it and sent it as 'Bearer {token}' in the authorization header.


# Testing

We are using jest and apollo-server-testing to run tests for this project.

Following are the test cases we are going to cover:
queries.js file-
1. Check if a field 'roof' to be included in the response.
2. Check if a field 'roof' to not contain in the response.

To run the tests please run the command 'npm run test' in the command line and the tests should finish with all success message.