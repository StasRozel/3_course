const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  logging: false, 
});

const Faculty = sequelize.define('Faculty', {
  faculty: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  faculty_name: {
    type: DataTypes.STRING(50),
  }
}, {
  tableName: 'faculty',
  timestamps: false,
});

const Pulpit = sequelize.define('Pulpit', {
  pulpit: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  pulpit_name: {
    type: DataTypes.STRING(100),
  },
  faculty: {
    type: DataTypes.STRING(10),
    references: {
      model: Faculty,
      key: 'faculty',
    },
    allowNull: false
  }
}, {
  tableName: 'pulpit',
  timestamps: false,
});

const Teacher = sequelize.define('Teacher', {
  teacher: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  teacher_name: {
    type: DataTypes.STRING(50),
  },
  pulpit: {
    type: DataTypes.STRING(10),
    references: {
      model: Pulpit,
      key: 'pulpit',
    },
    allowNull: false
  }
}, {
  tableName: 'teacher',
  timestamps: false,
});

const Subject = sequelize.define('Subject', {
  subject: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  subject_name: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  pulpit: {
    type: DataTypes.STRING(10),
    references: {
      model: Pulpit,
      key: 'pulpit',
    },
    allowNull: false
  }
}, {
  tableName: 'subject',
  timestamps: false,
});

const AuditoriumType = sequelize.define('AuditoriumType', {
  auditorium_type: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  auditorium_typename: {
    type: DataTypes.STRING(30),
    allowNull: false
  }
}, {
  tableName: 'auditorium_type',
  timestamps: false,
});

const Auditorium = sequelize.define('Auditorium', {
  auditorium: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false
  },
  auditorium_name: {
    type: DataTypes.STRING(200),
  },
  auditorium_capacity: {
    type: DataTypes.INTEGER,
  },
  auditorium_type: {
    type: DataTypes.STRING(10),
    references: {
      model: AuditoriumType,
      key: 'auditorium_type',
    },
    allowNull: false
  }
}, {
  tableName: 'auditorium',
  timestamps: false,
});

module.exports = {
  sequelize,
  Faculty,
  Pulpit,
  Teacher,
  Subject,
  AuditoriumType,
  Auditorium
};
