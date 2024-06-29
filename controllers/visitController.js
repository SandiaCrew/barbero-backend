const Visit = require("../models/Visit");
const ObjectId = require("mongodb").ObjectId;

exports.apiGetVisitsByClient = function(req, res) {
    const clientId = new ObjectId(req.params.clientId);

    Visit.findAllByClientId(clientId)
        .then(visits => {
            if (visits.length > 0) {
                res.status(200).json(visits);
            } else {
                res.status(200).json({ message: "No visits logged yet" });
            }
        })
        .catch(errors => {
            res.status(500).json({ error: "Failed to retrieve visits", details: errors });
        });
};

exports.apiCreateVisit = function(req, res) {
    let visit = new Visit(req.body);
    visit.create()
        .then((result) => {
            res.status(201).json({ message: "Visit logged successfully", id: result._id });
        })
        .catch(errors => {
            if (errors.includes("Visit already logged for today.")) {
                res.status(409).json({ error: "Visit already logged for today" });
            } else {
                res.status(500).json({ error: "Failed to log visit", details: errors });
            }
        });
};
