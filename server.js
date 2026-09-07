import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';

// Get current directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';
const PORT = process.env.PORT || 3000;

const app = express();

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error fetching organizations:', error);
        res.status(500).send('Error loading organizations');
    }
});

app.get('/projects', async (req, res) => {
    const title = 'Service Projects';
    res.render('projects', { title });
});

app.get('/categories', async (req, res) => {
    const title = 'Service Categories';
    res.render('categories', { title });
});


/**
 * Start the server
 */
app.listen(PORT, async () => {
    try {
        await testConnection();
        console.log(`🚀 Server is running at http://127.0.0.1:${PORT}`);
        console.log(`🌍 Environment: ${NODE_ENV}`);
    } catch (error) {
        console.error('❌ Error connecting to the database:', error);
        process.exit(1);
    }
});