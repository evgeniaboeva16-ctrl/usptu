require('dotenv').config(); // Load environment variables from .env
const sequelize = require('./database/config');
const models34 = require('./database/models34');

async function testModels() {
    try {
        console.log('🔄 Connecting to database...');
        await sequelize.authenticate();
        console.log('✅ Database connection established successfully.');

        console.log('🔄 Checking models34.js...');
        // Log the imported models to verify they are loaded correctly
        console.log('Loaded models:', Object.keys(models34));

        console.log('🔄 Attempting to sync specific models (create tables if missing)...');
        // Using force: false to avoid dropping existing data, alter: false to be safe but check schema
        // Note: models34 imports sequelize instance which defines the models, so sequelize.sync() would sync ALL models defined on that instance
        // To test just these, we can inspect them or just run a full sync check.

        await sequelize.sync({ alter: true }); // This will update the DB schema to match the models
        console.log('✅ Models synced successfully! Tables should be created in the DB.');

    } catch (error) {
        console.error('❌ Error testing models:', error);
    } finally {
        await sequelize.close();
    }
}

testModels();
