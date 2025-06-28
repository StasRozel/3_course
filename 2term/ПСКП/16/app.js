const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const sql = require("mssql");
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: true, 
        trustServerCertificate: true 
    }
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

const typeDefs = `
type Faculty {
  faculty: String!
  faculty_name: String
}

type Pulpit {
  pulpit: String!
  pulpit_name: String
  faculty: String
}

type Teacher {
  teacher: String!
  teacher_name: String
  pulpit: String
}

type Subject {
  subject: String!
  subject_name: String
  pulpit: String
}

type PulpitSubject {
  pulpit: String
  pulpit_name: String
  subject: String
  subject_name: String
}

type Query {
  getFaculties(faculty: String): [Faculty]
  getTeachers(teacher: String): [Teacher]
  getPulpits(pulpit: String): [Pulpit]
  getSubjects(subject: String): [Subject]
  getTeachersByFaculty(faculty: String): [Teacher]
  getSubjectsByFaculties(faculty: String): [PulpitSubject]
}

type Mutation {
  setFaculty(faculty: FacultyInput): Faculty
  setTeacher(teacher: TeacherInput): Teacher
  setPulpit(pulpit: PulpitInput): Pulpit
  setSubject(subject: SubjectInput): Subject
  delFaculty(faculty: String!): Boolean
  delTeacher(teacher: String!): Boolean
  delPulpit(pulpit: String!): Boolean
  delSubject(subject: String!): Boolean
}

input FacultyInput {
  faculty: String!
  faculty_name: String
}

input TeacherInput {
  teacher: String!
  teacher_name: String
  pulpit: String
}

input PulpitInput {
  pulpit: String!
  pulpit_name: String
  faculty: String
}

input SubjectInput {
  subject: String!
  subject_name: String
  pulpit: String
}
`;

// Resolvers
const resolvers = {
  Query: {
    async getFaculties(_, { faculty }) {
      await poolConnect;
      try {
        if (faculty) {
          const result = await pool.request()
            .input('faculty', sql.NVarChar, faculty)
            .query('SELECT RTRIM(FACULTY) as faculty, FACULTY_NAME as faculty_name FROM FACULTY WHERE FACULTY = @faculty');
          return result.recordset;
        } else {
          const result = await pool.request()
            .query('SELECT RTRIM(FACULTY) as faculty, FACULTY_NAME as faculty_name FROM FACULTY');
          return result.recordset;
        }
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async getTeachers(_, { teacher }) {
      await poolConnect;
      try {
        if (teacher) {
          const result = await pool.request()
            .input('teacher', sql.NVarChar, teacher)
            .query('SELECT RTRIM(TEACHER) as teacher, TEACHER_NAME as teacher_name, RTRIM(PULPIT) as pulpit FROM TEACHER WHERE TEACHER = @teacher');
          return result.recordset;
        } else {
          const result = await pool.request()
            .query('SELECT RTRIM(TEACHER) as teacher, TEACHER_NAME as teacher_name, RTRIM(PULPIT) as pulpit FROM TEACHER');
          return result.recordset;
        }
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async getPulpits(_, { pulpit }) {
      await poolConnect;
      try {
        if (pulpit) {
          const result = await pool.request()
            .input('pulpit', sql.NVarChar, pulpit)
            .query('SELECT RTRIM(PULPIT) as pulpit, PULPIT_NAME as pulpit_name, RTRIM(FACULTY) as faculty FROM PULPIT WHERE PULPIT = @pulpit');
          return result.recordset;
        } else {
          const result = await pool.request()
            .query('SELECT RTRIM(PULPIT) as pulpit, PULPIT_NAME as pulpit_name, RTRIM(FACULTY) as faculty FROM PULPIT');
          return result.recordset;
        }
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async getSubjects(_, { subject }) {
      await poolConnect;
      try {
        if (subject) {
          const result = await pool.request()
            .input('subject', sql.NVarChar, subject)
            .query('SELECT RTRIM(SUBJECT) as subject, SUBJECT_NAME as subject_name, RTRIM(PULPIT) as pulpit FROM SUBJECT WHERE SUBJECT = @subject');
          return result.recordset;
        } else {
          const result = await pool.request()
            .query('SELECT RTRIM(SUBJECT) as subject, SUBJECT_NAME as subject_name, RTRIM(PULPIT) as pulpit FROM SUBJECT');
          return result.recordset;
        }
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async getTeachersByFaculty(_, { faculty }) {
      await poolConnect;
      try {
        const result = await pool.request()
          .input('faculty', sql.NVarChar, faculty)
          .query(`
            SELECT RTRIM(T.TEACHER) as teacher, T.TEACHER_NAME as teacher_name, RTRIM(T.PULPIT) as pulpit 
            FROM TEACHER T
            JOIN PULPIT P ON T.PULPIT = P.PULPIT
            WHERE P.FACULTY = @faculty
          `);
        return result.recordset;
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async getSubjectsByFaculties(_, { faculty }) {
      await poolConnect;
      try {
        const result = await pool.request()
          .input('faculty', sql.NVarChar, faculty)
          .query(`
            SELECT 
              RTRIM(P.PULPIT) as pulpit, 
              P.PULPIT_NAME as pulpit_name, 
              RTRIM(S.SUBJECT) as subject, 
              S.SUBJECT_NAME as subject_name
            FROM PULPIT P
            JOIN SUBJECT S ON P.PULPIT = S.PULPIT
            WHERE P.FACULTY = @faculty
          `);
        return result.recordset;
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },
  },

  Mutation: {
    async setFaculty(_, { faculty }) {
      await poolConnect;
      try {
        const result = await pool.request()
          .input('faculty', sql.NVarChar, faculty.faculty)
          .input('faculty_name', sql.NVarChar, faculty.faculty_name)
          .query(`
            INSERT INTO FACULTY (FACULTY, FACULTY_NAME) 
            VALUES (@faculty, @faculty_name); 
            SELECT RTRIM(FACULTY) as faculty, FACULTY_NAME as faculty_name 
            FROM FACULTY WHERE FACULTY = @faculty
          `);
        return result.recordset[0];
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async setTeacher(_, { teacher }) {
      await poolConnect;
      try {
        const result = await pool.request()
          .input('teacher', sql.NVarChar, teacher.teacher)
          .input('teacher_name', sql.NVarChar, teacher.teacher_name)
          .input('pulpit', sql.NVarChar, teacher.pulpit)
          .query(`
            INSERT INTO TEACHER (TEACHER, TEACHER_NAME, PULPIT) 
            VALUES (@teacher, @teacher_name, @pulpit); 
            SELECT RTRIM(TEACHER) as teacher, TEACHER_NAME as teacher_name, RTRIM(PULPIT) as pulpit 
            FROM TEACHER WHERE TEACHER = @teacher
          `);
        return result.recordset[0];
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async setPulpit(_, { pulpit }) {
      await poolConnect;
      try {
        const result = await pool.request()
          .input('pulpit', sql.NVarChar, pulpit.pulpit)
          .input('pulpit_name', sql.NVarChar, pulpit.pulpit_name)
          .input('faculty', sql.NVarChar, pulpit.faculty)
          .query(`
            INSERT INTO PULPIT (PULPIT, PULPIT_NAME, FACULTY) 
            VALUES (@pulpit, @pulpit_name, @faculty); 
            SELECT RTRIM(PULPIT) as pulpit, PULPIT_NAME as pulpit_name, RTRIM(FACULTY) as faculty 
            FROM PULPIT WHERE PULPIT = @pulpit
          `);
        return result.recordset[0];
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async setSubject(_, { subject }) {
      await poolConnect;
      try {
        const result = await pool.request()
          .input('subject', sql.NVarChar, subject.subject)
          .input('subject_name', sql.NVarChar, subject.subject_name)
          .input('pulpit', sql.NVarChar, subject.pulpit)
          .query(`
            INSERT INTO SUBJECT (SUBJECT, SUBJECT_NAME, PULPIT) 
            VALUES (@subject, @subject_name, @pulpit); 
            SELECT RTRIM(SUBJECT) as subject, SUBJECT_NAME as subject_name, RTRIM(PULPIT) as pulpit 
            FROM SUBJECT WHERE SUBJECT = @subject
          `);
        return result.recordset[0];
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async delFaculty(_, { faculty }) {
      await poolConnect;
      try {
        await pool.request()
          .input('faculty', sql.NVarChar, faculty)
          .query('DELETE FROM FACULTY WHERE FACULTY = @faculty');
        return true;
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async delTeacher(_, { teacher }) {
      await poolConnect;
      try {
        await pool.request()
          .input('teacher', sql.NVarChar, teacher)
          .query('DELETE FROM TEACHER WHERE TEACHER = @teacher');
        return true;
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async delPulpit(_, { pulpit }) {
      await poolConnect;
      try {
        await pool.request()
          .input('pulpit', sql.NVarChar, pulpit)
          .query('DELETE FROM PULPIT WHERE PULPIT = @pulpit');
        return true;
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },

    async delSubject(_, { subject }) {
      await poolConnect;
      try {
        await pool.request()
          .input('subject', sql.NVarChar, subject)
          .query('DELETE FROM SUBJECT WHERE SUBJECT = @subject');
        return true;
      } catch (err) {
        console.error('SQL error', err);
        throw err;
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen(3001, () => {
    console.log("Server running on http://localhost:3001/graphql");
  });
});