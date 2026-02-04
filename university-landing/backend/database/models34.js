const { DataTypes } = require('sequelize');
const sequelize = require('./config');

// Import base models for associations
const { User, AbiturientProfile, School, Region } = require('./models');

// Новые модели по расширению проекта
// Модель FiasAddress
const FiasAddress = sequelize.define('fias_addresses', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: { // FK to AbiturientProfile.user_id (which is User.id)
    type: DataTypes.INTEGER,
    allowNull: false
  },
  region_code_fias: {
    type: DataTypes.STRING(2),
    allowNull: false
  },
  region_guid_fias: {
    type: DataTypes.UUID,
    allowNull: false
  },
  region_name_fias: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  region_type_fias: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  district_guid_fias: {
    type: DataTypes.UUID
  },
  district_name_fias: {
    type: DataTypes.STRING(255)
  },
  district_type_fias: {
    type: DataTypes.STRING(50)
  },
  locality_guid_fias: {
    type: DataTypes.UUID,
    allowNull: false
  },
  locality_name_fias: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  locality_type_fias: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  street_guid_fias: {
    type: DataTypes.UUID
  },
  street_name_fias: {
    type: DataTypes.STRING(255)
  },
  street_type_fias: {
    type: DataTypes.STRING(50)
  },
  house_guid_fias: {
    type: DataTypes.UUID,
    allowNull: false
  },
  house_num: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  building: {
    type: DataTypes.STRING(20)
  },
  structure: {
    type: DataTypes.STRING(20)
  },
  apartment: {
    type: DataTypes.STRING(20)
  },
  full_address_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  postal_code: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  address_type: { // For differentiating between registration, residence, etc. if multiple addresses per user
    type: DataTypes.STRING(50),
    defaultValue: 'registration'
  }
}, {
  tableName: 'fias_addresses',
  timestamps: false
});

// Модель EducationDocumentType (СправочникВидДокументаОбОбразовании)
const EducationDocumentType = sequelize.define('education_document_types', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'education_document_types',
  timestamps: false
});

// Модель EducationDocument (ДокументОбОбразовании)
const EducationDocument = sequelize.define('education_documents', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  user_id: { // FK to AbiturientProfile.user_id (which is User.id)
    type: DataTypes.INTEGER,
    allowNull: false
  },
  school_id: { // FK to School.id
    type: DataTypes.INTEGER,
    allowNull: false
  },
  document_type_id: { // FK to EducationDocumentType.id
    type: DataTypes.UUID,
    allowNull: false
  },
  series: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  number: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  issue_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  graduation_year: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  average_grade: {
    type: DataTypes.DECIMAL(4,2)
  },
  frdo_unique_id: {
    type: DataTypes.STRING(100)
  }
}, {
  tableName: 'education_documents',
  timestamps: false
});

// Определение ассоциаций
// Эти ассоциации связывают новые модели с существующими, импортированными из models.js
AbiturientProfile.hasMany(FiasAddress, { foreignKey: 'user_id', as: 'FiasAddresses' });
FiasAddress.belongsTo(AbiturientProfile, { foreignKey: 'user_id' });

AbiturientProfile.hasMany(EducationDocument, { foreignKey: 'user_id', as: 'EducationDocuments' });
EducationDocument.belongsTo(AbiturientProfile, { foreignKey: 'user_id' });

School.hasMany(EducationDocument, { foreignKey: 'school_id', as: 'IssuedDocuments' });
EducationDocument.belongsTo(School, { foreignKey: 'school_id' });

EducationDocumentType.hasMany(EducationDocument, { foreignKey: 'document_type_id', as: 'DocumentsOfType' });
EducationDocument.belongsTo(EducationDocumentType, { foreignKey: 'document_type_id' });

// Экспорт новых моделей
module.exports = {
  FiasAddress,
  EducationDocumentType,
  EducationDocument
};
