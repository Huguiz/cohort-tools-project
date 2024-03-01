const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student.model");
const Cohort = require("./models/Cohort.model");
const { errorHandler, notFoundHandler } = require('./middleware/error-handling');

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
    .populate("cohort")
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ error: "Failed to retrieve students" });
    });
});

app.get("/api/students/cohort/:cohortId", (req, res) => {
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

app.get("/api/students/:studentId", (req, res) => {
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
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: "Error creating a new student" })
    });
});

app.put("/api/students/:studentId", (req, res) => {
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

app.delete("/api/students/:studentId", (req, res) => {
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

// COHORTS ROUTES

app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      res.json(cohorts);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ error: "Failed to retrieve cohorts" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findById({ _id: req.params.cohortId })
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((error) => {
      console.log(error)
      res.status(500).json({ error: "Failed to retrieve cohort" });
    });
});

app.get("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findById({ _id: req.params.cohortId })
    .then((cohort) => {
      res.json(cohort);
    })
    .catch((error) => {
      console.log(error)
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
    .catch((error) => {
      console.log(error)
      res.status(500).json({ message: "Error creating a new cohort" })
    });
});

app.put("/api/cohorts/:cohortId", (req, res) => {
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

app.delete("/api/cohorts/:cohortId", (req, res) => {
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

app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
