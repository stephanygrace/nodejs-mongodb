const { MongoClient } = require('mongodb');

async function main() {

    let password = "admin123"
    const uri = `mongodb+srv://stelle:${password}@fiore.4yqzzox.mongodb.net/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri);


    try {
        await client.connect();
        await createManyListing(client, [
            {
            name: "Stephany Grace",
            summary: "Chill Vibes",
            bedrooms: 1,
            bathrooms: 1,
            },
            {
                name: "Grace",
                summary: "Chill",
                bedrooms: 2,
                bathrooms: 2,
            },
            {
                name: "Stephany",
                summary: "Vibes",
                bedrooms: 3,
                bathrooms: 3,
            },
        ] )
    }
    catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }

}

main().catch(console.error);

async function createListing(client, newListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertOne(newListing);

    console.log(`The new listing created with the following id: ${result.insertedId}`)
}

async function createManyListing(client, manyListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").insertMany(manyListing);

    console.log(`${result.insertedCount} new listings are created with the following IDs: `);
    console.log(result.insertedIds);
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases: ");
    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}