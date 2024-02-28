const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");

// STATIC DATA
const PORT = 5005;

// INITIALIZE EXPRESS APP
const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose
  .connect("mongodb://localhost:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// DOCS ROUTES

app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


// STUDENTS ROUTES

app.get("/api/students", (req, res) => {
  Student.find({})
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
  Student.find({cohort: req.params.cohortId})
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

// app.get("/api/students/cohort/:cohortId", (req, res) => {
//   Student.find({ cohort: req.params.cohortId })
//     .populate("cohort")
//     .then((allStudents) => {
//       res.status(200).json(allStudents);
//     })
//     .catch((error) => {
//       console.error("Error while retrieving students ->", error);
//       res.status(500).json({ message: "Error getting all Students" });
//     });
// });

app.post("/api/students", (req, res) => {
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
    .catch((e) => {
      res.status(500).json({ message: "Error creating a new student" })
    });
});

// COHORTS ROUTES

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      res.json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts ->", error);
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  Cohort.find({ cohortSlug: req.params.cohortId })
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((error) => {
      console.error("Error while retrieving cohort ->", error);
      res.status(500).json({ error: "Failed to retrieve cohort" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  Cohort.find({ cohortSlug: req.params.cohortId })
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((error) => {
      res.status(500).json({ error: "Failed to retrieve cohort" });
    });
});

app.post("/api/cohorts", (req, res) => {
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
    .catch((e) => {
      res.status(500).json({ message: "Error creating a new cohort" })
    });
});

app.put("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findOneAndUpdate({ cohortSlug: req.params.cohortId }, req.body, { new: true })
    .then((updatedCohort) => {
      if (!updatedCohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      res.json(updatedCohort);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error updating Cohort" });
    });
});

app.delete("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findOneAndDelete({ cohortSlug: req.params.cohortId })
    .then((deletedCohort) => {
      if (!deletedCohort) {
        return res.status(404).json({ message: "Cohort not found" });
      }
      res.status(204).send();
    })
    .catch((error) => {
      res.status(500).json({ message: "Error deleting Cohort" });
    });
});



// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
