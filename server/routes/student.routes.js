const router = require('express').Router();

const Student = require('../models/Student.model');

router.get("/", (req, res) => {
    Student.find({})
        .populate("cohort")
        .then((students) => {
            res.json(students);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: "Failed to retrieve students" });
        });
});

router.get("/cohort/:cohortId", (req, res) => {
    Student.find({ cohort: req.params.cohortId })
        .populate("cohort")
        .then((students) => {
            res.json(students);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: "Failed to retrieve students" });
        });
});

router.get("/:studentId", (req, res) => {
    Student.findById(req.params.studentId)
        .populate("cohort")
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.json(updatedStudent);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ error: "Failed to retrieve student" });
        });
});

router.post("/", (req, res) => {
    Student.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
        linkedinUrl: req.body.linkedinUrl,
        languages: req.body.languages,
        program: req.body.program,
        background: req.body.background,
        image: req.body.image,
        cohort: req.body.cohort,
        projects: req.body.projects
    })
        .then((studentFromDB) => {
            res.json(studentFromDB)
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error creating a new student" })
        });
});

router.put("/:studentId", (req, res) => {
    Student.findByIdAndUpdate({ _id: req.params.studentId }, req.body, { new: true })
        .then((updatedStudent) => {
            if (!updatedStudent) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.json(updatedStudent);
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error updating Student" });
        });
});

router.delete("/:studentId", (req, res) => {
    Student.findByIdAndDelete({ _id: req.params.studentId })
        .then((deletedCohort) => {
            if (!deletedCohort) {
                return res.status(404).json({ message: "Student not found" });
            }
            res.status(204).send();
        })
        .catch((error) => {
            console.log(error)
            res.status(500).json({ message: "Error deleting Student" });
        });
});

module.exports = router;