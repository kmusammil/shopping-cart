const { MongoClient } = require('mongodb');

// MongoDB Atlas connection URI
const uri = "mongodb+srv://atlasdbuser:atlasdbpassword@atlasdbcluster.9ukej.mongodb.net/atlasdbdatabase?retryWrites=true&w=majority&appName=atlasdbCluster";

// Initialize a client instance
const client = new MongoClient(uri);

// To store the connected database instance
let dbConnection;

module.exports = {
  // Function to establish connection to MongoDB Atlas
  connectToDatabase: async function (done) {
    try {
      // If no connection exists, create one
      if (!dbConnection) {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        dbConnection = client.db(); // Select the default database
        done();
      }
    } catch (err) {
      console.error("Error connecting to MongoDB Atlas:", err);
      done(err); // Pass the error to the callback
    }
  },
  
  // Function to return the connected database instance
  getDb: function () {
    if (!dbConnection) {
      throw new Error("Database not connected. Call connectToDatabase first.");
    }
    return dbConnection;
  }
};
