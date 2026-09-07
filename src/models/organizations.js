import db from './db.js';

/**
 * Get all organizations from the database
 * @returns {Promise<Array>} Array of organization objects
 */
const getAllOrganizations = async () => {
    const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
        FROM public.organization
        ORDER BY name;
    `;
    
    const result = await db.query(query);
    return result.rows;
};

export { getAllOrganizations };