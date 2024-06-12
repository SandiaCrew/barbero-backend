const mongodb = require('mongodb');
const visitsCollection = require('../db').db().collection("visits");

// This is our recipe book for keeping track of visits.
let Visit = function(data) {
    this.data = data;
    this.errors = [];
}

// Making sure each entry in our visit book is neat and correct.
Visit.prototype.cleanUp = function() {
    // Check if the date is actually a date; if not, record today's date.
    if (!(this.data.date instanceof Date)) {
        this.data.date = new Date();
    }

    // Overwrite with cleaned up data
    this.data = {
        clientId: new mongodb.ObjectId(this.data.clientId), // Link to a client using their unique ID
        date: this.data.date, // The exact date and time they visited
        hour: this.data.date.getHours(), // What hour they visited
        minute: this.data.date.getMinutes() // What minute they visited
    };
}

// We're not really validating much here because we auto-capture the date and time.
Visit.prototype.validate = function() {
    if (!this.data.clientId) {
        this.errors.push("Missing client ID - each visit must be linked to a client.");
    }
}

// Saving the visit information into our visits drawer.
Visit.prototype.create = function() {
    return new Promise(async (resolve, reject) => {
        this.cleanUp(); // First, we tidy up the info.
        this.validate(); // Then we check if everything's okay.
        if (!this.errors.length) {
            try {
                const result = await visitsCollection.insertOne(this.data);
                this.data._id = result.insertedId; // MongoDB gives us a special tag so we can find this visit again.
                resolve(this.data); // We did it! The visit info is saved.
            } catch (e) {
                this.errors.push("Database error: " + e);
                reject(this.errors); // Oops! Something went wrong, and we didn't save the visit.
            }
        } else {
            reject(this.errors); // There was something wrong with the info, so we didn't save it.
        }
    });
}

// Adding a method to find all visits by a specific client ID.
Visit.findAllByClientId = function(clientId) {
    // Convert string ID to MongoDB ObjectId format if necessary
    if (typeof(clientId) === 'string') {
        clientId = new mongodb.ObjectId(clientId);
    }

    return visitsCollection.find({ clientId: clientId }).toArray(); // Search for all visits with the given client ID.
}

// Let's make sure we can use our Visit book elsewhere in our clubhouse!
module.exports = Visit;
