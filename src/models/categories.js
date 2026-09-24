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

/**
 * Assign a category to a project
 */
const assignCategoryToProject = async (categoryId, projectId) => {
    const query = `
        INSERT INTO project_category (category_id, project_id)
        VALUES ($1, $2);
    `;
    await db.query(query, [categoryId, projectId]);
};


const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove existing assignments
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;
    await db.query(deleteQuery, [projectId]);

    // Add new assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(categoryId, projectId);
    }
};

/**
 * Create a new category in the database
 * @param {string} name - The category name
 * @returns {Promise<number>} The new category ID
 */
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const result = await db.query(query, [name]);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new category with ID:', result.rows[0].category_id);
    }

    return result.rows[0].category_id;
};

/**
 * Update an existing category in the database
 * @param {number} categoryId - The category ID
 * @param {string} name - The new category name
 * @returns {Promise<number>} The updated category ID
 */
const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const result = await db.query(query, [name, categoryId]);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Updated category with ID:', categoryId);
    }

    return result.rows[0].category_id;
};


export { 
    getAllCategories, 
    getCategoryDetails, 
    getProjectsByCategoryId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
};