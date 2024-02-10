const { MongoClient } = require('mongodb');

async function main() {

    let password = "admin123"
    const uri = `mongodb+srv://stelle:${password}@fiore.4yqzzox.mongodb.net/?retryWrites=true&w=majority`;

    const client = new MongoClient(uri);


    try {
        await client.connect();
        // await createManyListing(client, [
        //     {
        //     name: "Stephany Grace",
        //     summary: "Chill Vibes",
        //     bedrooms: 1,
        //     bathrooms: 1,
        //     },
        //     {
        //         name: "Grace",
        //         summary: "Chill",
        //         bedrooms: 2,
        //         bathrooms: 2,
        //     },
        //     {
        //         name: "Stephany",
        //         summary: "Vibes",
        //         bedrooms: 3,
        //         bathrooms: 3,
        //     },
        // ] )

        // await findOneListingByName(client, "Stephany")

        // await findListingsWithFilter(client, {
        //     minimumNumberOfBedrooms: 4,
        //     minimumNumberOfBathrooms: 2,
        //     maximumNumberOfResults: 5
        // })

        // await updateOneListingByName(client, "Stephany", {
        //     bedrooms: 23,
        //     beds: 73
        // })

        // await upsertListing(client, "Tepanyii", {
        //     name: "Tepanyii",
        //     bedrooms: 5,
        //     bathrooms: 2
        // })

        await updateAllListings(client)
    }
    catch (e) {
        console.log(e)
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function updateAllListings(client) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateMany({
        property_type: { $exists: false } },
        { $set: {property_type: "Unknown"}}
        );

        console.log(`${result.matchedCount} documents matched`);
        console.log(`${result.modifiedCount} documents modified`)

}

async function upsertListing(client, nameOfListing, updatedListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name: nameOfListing}, {$set: updatedListing}, {upsert: true})

    console.log(`${result.matchedCount} documents matched`);

    if (result.upsertedCount > 0) {
        console.log(`Document is upserted with ID ${result.upsertedId}`)
    } else{
        console.log(`${result.modifiedCount} documents updated`)
    }
}

async function updateOneListingByName (client, nameOfListing, updatedListing) {
   const result = await client.db("sample_airbnb").collection("listingsAndReviews").updateOne({name: nameOfListing}, {$set: updatedListing})

   console.log(`${result.matchedCount} documents`);
   console.log(`${result.modifiedCount} documents updated`)
}

async function findListingsWithFilter(client, {
    minimumNumberOfBedrooms = 0,
    minimumNumberOfBathrooms = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}) {
    const cursor = await client.db("sample_airbnb").collection("listingsAndReviews").find({
        bedrooms: { $gte: minimumNumberOfBedrooms},
        bathrooms: { $gte: minimumNumberOfBathrooms}
    }).sort({ last_review: -1})
    .limit(maximumNumberOfResults);

    const result = await cursor.toArray();
    if(result){
        console.log(result)
    } else {
        console.log("No Listings Found")
    }
}

async function findOneListingByName(client, nameOfListing) {
    const result = await client.db("sample_airbnb").collection("listingsAndReviews").findOne({name: nameOfListing});

    if (result){
        console.log(result)
    } else {
        console.log("No document found!")
    }
}


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