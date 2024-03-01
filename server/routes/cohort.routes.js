const router = require('express').Router();

const Cohort = require('../models/Cohort.model');

router.get("/", (req, res) => {
    Cohort.find({})
        .then((cohorts) => {
            res.json(cohorts);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: "Failed to retrieve cohorts" });
        });
});

router.get("/:cohortId", (req, res) => {
    Cohort.findById({ _id: req.params.cohortId })
        .then((cohort) => {
            res.json(cohort);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: "Failed to retrieve cohort" });
        });
});

router.get("/:cohortId", (req, res) => {
    Cohort.findById({ _id: req.params.cohortId })
        .then((cohort) => {
            res.json(cohort);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: "Failed to retrieve cohort" });
        });
});

router.post("/", (req, res) => {
    Cohort.create({
        inProgress: req.body.inProgress,
        cohortSlug: req.body.cohortSlug,
        cohortName: req.body.cohortName,
        program: req.body.program,
        campus: req.body.campus,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        programManager: req.body.programManager,
        leadTeacher: req.body.leadTeacher,
        totalHours: req.body.totalHours
    })
        .then((cohortFromDB) => {
            res.json(cohortFromDB)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error creating a new cohort" })
        });
});

router.put("/:cohortId", (req, res) => {
    Cohort.findByIdAndUpdate({ _id: req.params.cohortId }, req.body, { new: true })
        .then((updatedCohort) => {
            if (!updatedCohort) {
                return res.status(404).json({ message: "Cohort not found" });
            }
            res.json(updatedCohort);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error updating Cohort" });
        });
});

router.delete("/:cohortId", (req, res) => {
    Cohort.findByIdAndDelete({ _id: req.params.cohortId })
        .then((deletedCohort) => {
            if (!deletedCohort) {
                return res.status(404).json({ message: "Cohort not found" });
            }
            res.status(204).send();
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error deleting Cohort" });
        });
});

module.exports = router;