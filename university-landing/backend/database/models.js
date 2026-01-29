const { DataTypes } = require('sequelize');
const sequelize = require('./config');

// Модель User
const User = sequelize.define('users', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  password_hash: {
    type: DataTypes.STRING(255)
  },
  role: {
    type: DataTypes.STRING(20),
    defaultValue: 'abiturient'
  },
  full_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  telegram_id: {
    type: DataTypes.STRING(100)
  },
  vk_id: {
    type: DataTypes.STRING(100)
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  last_login: {
    type: DataTypes.DATE
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  timestamps: false
});

// Модель AbiturientProfile
const AbiturientProfile = sequelize.define('abiturient_profiles', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true
  },
  birth_date: {
    type: DataTypes.DATE
  },
  school_id: {
    type: DataTypes.INTEGER
  },
  grade: {
    type: DataTypes.INTEGER
  },
  region_id: {
    type: DataTypes.INTEGER
  },
  interests: {
    type: DataTypes.TEXT
  },
  parent_name: {
    type: DataTypes.STRING(100)
  },
  parent_phone: {
    type: DataTypes.STRING(20)
  },
  consent_signed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  consent_date: {
    type: DataTypes.DATE
  },
  preferred_faculties: {
    type: DataTypes.TEXT
  },
  event_history_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_event_date: {
    type: DataTypes.DATE
  }
}, {
  tableName: 'abiturient_profiles',
  timestamps: false
});

// Модель School
const School = sequelize.define('schools', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  city: {
    type: DataTypes.STRING(100)
  },
  address: {
    type: DataTypes.STRING(255)
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(100)
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'schools',
  timestamps: false
});

// Модель Region
const Region = sequelize.define('regions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  federal_district: {
    type: DataTypes.STRING(50)
  }
}, {
  tableName: 'regions',
  timestamps: false
});

module.exports = {
  sequelize,
  User,
  AbiturientProfile,
  School,
  Region
};