import db from './db.js';

/**
 * Get all categories from the database
 * @returns {Promise<Array>} Array of category objects
 */
const getAllCategories = async () => {
    const query = `
        SELECT category_id, name
        FROM category
        ORDER BY name;
    `;
    
    const result = await db.query(query);
    return result.rows;
};

/**
 * Get a single category by ID
 * @param {number} id - The category ID
 * @returns {Promise<Object|null>} Category object or null if not found
 */
const getCategoryDetails = async (id) => {
    const query = `
        SELECT category_id, name
        FROM category
        WHERE category_id = $1;
    `;
    
    const result = await db.query(query, [id]);
    return result.rows.length > 0 ? result.rows[0] : null;
};

/**
 * Get all projects for a specific category
 * @param {number} categoryId - The category ID
 * @returns {Promise<Array>} Array of project objects
 */
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT p.project_id, p.title, p.description, p.location, p.date,
               o.name as organization_name, o.organization_id
        FROM project p
        JOIN project_category pc ON p.project_id = pc.project_id
        JOIN organization o ON p.organization_id = o.organization_id
        WHERE pc.category_id = $1
        ORDER BY p.date;
    `;
    
    const result = await db.query(query, [categoryId]);
    return result.rows;
};

// Export the model functions
export { getAllCategories, getCategoryDetails, getProjectsByCategoryId };