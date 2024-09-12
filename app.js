require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const { sequelize } = require('./models');

// Enable CORS for all routes
app.use(cors());

const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0', // Add this to use OpenAPI 3.0 spec
        info: {
            title: 'Fastamoni API',
            version: '1.0.0',
            description: 'API for Fastamoni application',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'], // Paths to route files
};


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const walletRoutes = require('./routes/wallet');
const donationRoutes = require('./routes/donations');

app.use('/auth', authRoutes);
app.use('/wallet', walletRoutes);
app.use('/donations', donationRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.send('Welcome to Fastamoni API');
});

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ message: 'Something went wrong!' });
});

app.get('/health', (req, res) => {
    res.status(200).send({ status: 'ok' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    // Test the database connection
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});
