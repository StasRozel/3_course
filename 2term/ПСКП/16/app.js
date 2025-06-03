const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "KVF",
  password: "rootroot",
  port: 5432,
});

// GraphQL-схема и резолверы
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
}

`;

// Резолверы
const resolvers = {
    Query: {
      async getFaculties(_, { faculty }) {
        const client = await pool.connect();
        try {
          if (faculty) {
            const result = await client.query('SELECT * FROM FACULTY WHERE FACULTY = $1', [faculty]);
            return result.rows;
          } else {
            const result = await client.query('SELECT * FROM FACULTY');
            return result.rows;
          }
        } finally {
          client.release();
        }
      },
  
      async getTeachers(_, { teacher }) {
        const client = await pool.connect();
        try {
          if (teacher) {
            const result = await client.query('SELECT * FROM TEACHER WHERE TEACHER = $1', [teacher]);
            return result.rows;
          } else {
            const result = await client.query('SELECT * FROM TEACHER');
            return result.rows;
          }
        } finally {
          client.release();
        }
      },
  
      async getPulpits(_, { pulpit }) {
        const client = await pool.connect();
        try {
          if (pulpit) {
            const result = await client.query('SELECT * FROM PULPIT WHERE PULPIT = $1', [pulpit]);
            return result.rows;
          } else {
            const result = await client.query('SELECT * FROM PULPIT');
            return result.rows;
          }
        } finally {
          client.release();
        }
      },
  
      async getSubjects(_, { subject }) {
        const client = await pool.connect();
        try {
          if (subject) {
            const result = await client.query('SELECT * FROM SUBJECT WHERE SUBJECT = $1', [subject]);
            return result.rows;
          } else {
            const result = await client.query('SELECT * FROM SUBJECT');
            return result.rows;
          }
        } finally {
          client.release();
        }
      },
  
      async getTeachersByFaculty(_, { faculty }) {
        const client = await pool.connect();
        try {
          const result = await client.query('SELECT * FROM TEACHER WHERE PULPIT IN (SELECT PULPIT FROM PULPIT WHERE FACULTY = $1)', [faculty]);
          return result.rows;
        } finally {
          client.release();
        }
      },

      async getSubjectsByFaculties(_, { faculty }) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            `SELECT PULPIT.PULPIT, PULPIT.PULPIT_NAME, SUBJECT.SUBJECT, SUBJECT.SUBJECT_NAME
             FROM PULPIT
             JOIN SUBJECT ON PULPIT.PULPIT = SUBJECT.PULPIT
             WHERE PULPIT.FACULTY = $1`, 
            [faculty]
          );
          return result.rows;
        } finally {
          client.release();
        }
      },
    },
  
    Mutation: {
      async setFaculty(_, { faculty }) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            'INSERT INTO FACULTY (FACULTY, FACULTY_NAME) VALUES ($1, $2) RETURNING *',
            [faculty.faculty, faculty.faculty_name]
          );
          return result.rows[0];
        } finally {
          client.release();
        }
      },
  
      async setTeacher(_, { teacher }) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            'INSERT INTO TEACHER (TEACHER, TEACHER_NAME, PULPIT) VALUES ($1, $2, $3) RETURNING *',
            [teacher.teacher, teacher.teacher_name, teacher.pulpit]
          );
          return result.rows[0];
        } finally {
          client.release();
        }
      },
  
      async setPulpit(_, { pulpit }) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            'INSERT INTO PULPIT (PULPIT, PULPIT_NAME, FACULTY) VALUES ($1, $2, $3) RETURNING *',
            [pulpit.pulpit, pulpit.pulpit_name, pulpit.faculty]
          );
          return result.rows[0];
        } finally {
          client.release();
        }
      },
  
      async setSubject(_, { subject }) {
        const client = await pool.connect();
        try {
          const result = await client.query(
            'INSERT INTO SUBJECT (SUBJECT, SUBJECT_NAME) VALUES ($1, $2) RETURNING *',
            [subject.subject, subject.subject_name]
          );
          return result.rows[0];
        } finally {
          client.release();
        }
      },
  
      async delFaculty(_, { faculty }) {
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM FACULTY WHERE FACULTY = $1', [faculty]);
          return true;
        } finally {
          client.release();
        }
      },
  
      async delTeacher(_, { teacher }) {
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM TEACHER WHERE TEACHER = $1', [teacher]);
          return true;
        } finally {
          client.release();
        }
      },
  
      async delPulpit(_, { pulpit }) {
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM PULPIT WHERE PULPIT = $1', [pulpit]);
          return true;
        } finally {
          client.release();
        }
      },
  
      async delSubject(_, { subject }) {
        const client = await pool.connect();
        try {
          await client.query('DELETE FROM SUBJECT WHERE SUBJECT = $1', [subject]);
          return true;
        } finally {
          client.release();
        }
      },
    },
  };
  
  
  const server = new ApolloServer({ typeDefs, resolvers });
  
  const app = express();
  server.start().then(() => {
    server.applyMiddleware({ app });
    app.listen(3000, () => {
      console.log("Server running on http://localhost:3000/graphql");
    });
  });