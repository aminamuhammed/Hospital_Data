const express = require("express");
const router = express.Router();
const fs = require("fs");

// Function to load hospital data from file
const loadHospital = () => {
    try {
        const dataBuffer = fs.readFileSync("hospitalData.json");
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (error) {
        console.error(error);
        return [];
    }
};

// Function to save hospital data to file
const saveHospital = (hospitals) => {
    try {
        const dataJSON = JSON.stringify(hospitals, null, 2);
        fs.writeFileSync("hospitalData.json", dataJSON);
    } catch (error) {
        console.error(error);
    }
};

// GET: Retrieve all hospital data
router.get("/", (req, res) => {
    const hospitals = loadHospital();
    res.send(hospitals);
});

// POST: Add new hospital data
router.post("/", (req, res) => {
    try {
        const hospitals = loadHospital();
        const newHospital = {
            id: hospitals.length + 1,
            hospitalName: req.body.hospitalName,
            patientCount: req.body.patientCount,
            hospitalLocation: req.body.hospitalLocation
        };
        hospitals.push(newHospital);
        saveHospital(hospitals);
        res.status(201).send(newHospital);
    } catch (error) {
        res.status(400).send({ error });
    }
});

// PATCH: Update hospital data by ID
router.patch("/:id", (req, res) => {
    try {
        const hospitals = loadHospital();
        const hospitalData = hospitals.find(i => i.id === parseInt(req.params.id)); 
        if (!hospitalData) {
            return res.status(404).send({ error: "Hospital data not found" });
        }
        hospitalData.hospitalName = req.body.hospitalName || hospitalData.hospitalName;
        hospitalData.patientCount = req.body.patientCount || hospitalData.patientCount;
        hospitalData.hospitalLocation = req.body.hospitalLocation || hospitalData.hospitalLocation;
        saveHospital(hospitals);
        res.status(200).send(hospitalData);
    } catch (error) {
        res.status(400).send(error);
    }
});


// DELETE: Remove hospital data by ID
router.delete("/:id", (req, res) => {
    try {
        const hospitals = loadHospital();
        const index = hospitals.findIndex(i => i.id === parseInt(req.params.id)); 
        if (index === -1) {
            return res.status(404).send({ error: "Hospital data not found" });
        }
        hospitals.splice(index, 1); 
        saveHospital(hospitals);
        res.send({ message: "Hospital data deleted" });
    } catch (error) {
        res.status(404).send(error);
    }
});

module.exports = router;
