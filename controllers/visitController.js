const Visit = require("../models/Visit"); // This gets our Visit book, which tells us how to write down visits.
const ObjectId = require("mongodb").ObjectId; // This tool helps us find things with special codes.

// This function gets all visits for a specific client.
exports.apiGetVisitsByClient = function(req, res) {
    const clientId = new ObjectId(req.params.clientId); // We get the special code for the client we're interested in.

    Visit.findAllByClientId(clientId) // We look in our visit book for all the times this client visited.
        .then(visits => {
            if (visits.length > 0) {
                res.status(200).json(visits); // If we find any visits, we show them all.
            } else {
                res.status(404).json({ message: "No visits found for this client" }); // If no visits are found, we say so.
            }
        })
        .catch(errors => {
            res.status(500).json({ error: "Failed to retrieve visits", details: errors }); // If something goes wrong, we tell what happened.
        });
};

// This function lets us add a new visit when a client comes.
exports.apiCreateVisit = function(req, res) {
    let visit = new Visit(req.body); // We start writing a new visit page using the info given.
    visit.create() // We try to save this new page in our big visit drawer.
        .then((result) => {
            res.status(201).json({ message: "Visit logged successfully", id: result._id }); // Tell everyone, "We wrote it down successfully!"
        })
        .catch(errors => {
            res.status(500).json({ error: "Failed to log visit", details: errors }); // If something goes wrong, we tell what happened.
        });
};
