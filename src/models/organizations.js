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

/**
 * Get a specific organization by ID
 * @param {number} organizationId - The organization ID
 * @returns {Promise<Object|null>} Organization object or null if not found
 */
const getOrganizationDetails = async (organizationId) => {
    const query = `
        SELECT
            organization_id,
            name,
            description,
            contact_email,
            logo_filename
        FROM organization
        WHERE organization_id = $1;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    // Return the first row of the result set, or null if no rows are found
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Export the model functions
export { getAllOrganizations, getOrganizationDetails };