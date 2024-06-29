const mongodb = require('mongodb');
const db = require('../db').db();
const collectionName = process.env.NODE_ENV === 'production' ? 'visits' : 'visits_dev';
const visitsCollection = db.collection(collectionName);

let Visit = function(data) {
    this.data = data;
    this.errors = [];
}

// Ensures data is clean and formatted correctly.
Visit.prototype.cleanUp = function() {
    if (!(this.data.date instanceof Date)) {
        this.data.date = new Date();
    }

    // Ensure the date is stripped of time information and only contains the date part.
    this.data.date = new Date(this.data.date.setHours(0, 0, 0, 0));

    // We will store only the clientId and the formatted date.
    this.data = {
        clientId: new mongodb.ObjectId(this.data.clientId),
        date: this.data.date
    };
}

// Validate that the visit has a client ID.
Visit.prototype.validate = function() {
    if (!this.data.clientId) {
        this.errors.push("Missing client ID - each visit must be linked to a client.");
    }
}

// Save the visit information into the database.
Visit.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp();
        this.validate();
        if (!this.errors.length) {
            try {
                const existingVisit = await visitsCollection.findOne({
                    clientId: this.data.clientId,
                    date: this.data.date
                });

                if (existingVisit) {
                    this.errors.push("Visit already logged for today.");
                    reject(this.errors);
                } else {
                    const result = await visitsCollection.insertOne(this.data);
                    this.data._id = result.insertedId;  // Include the newly created ID in the visit data.
                    resolve(this.data);
                }
            } catch (e) {
                this.errors.push("Database error: " + e);
                reject(this.errors);
            }
        } else {
            reject(this.errors);
        }
    });
}

// Find all visits associated with a specific client ID.
Visit.findAllByClientId = function(clientId) {
    if (typeof(clientId) === 'string') {
        clientId = new mongodb.ObjectId(clientId);
    }
    return visitsCollection.find({ clientId: clientId }).toArray();
}

module.exports = Visit;
