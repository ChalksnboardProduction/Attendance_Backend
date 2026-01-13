// Vercel serverless function wrapper for Express app
// This file is used by Vercel to handle all API routes

const app = require('../index');

// Export the Express app as a serverless function
module.exports = app;
