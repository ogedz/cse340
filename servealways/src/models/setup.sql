-- ============================================
-- CSE 340 - Complete Database Setup Script
-- ============================================

-- Drop tables in reverse order of dependencies
DROP TABLE IF EXISTS project_category CASCADE;
DROP TABLE IF EXISTS project CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS organization CASCADE;

-- ============================================
-- ORGANIZATION TABLE
-- ============================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES 
    ('BrightFuture Builders', 
     'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 
     'info@brightfuturebuilders.org', 
     'brightfuture-logo.png'),
    ('GreenHarvest Growers', 
     'An urban farming collective promoting food sustainability and education in local neighborhoods.', 
     'contact@greenharvest.org', 
     'greenharvest-logo.png'),
    ('UnityServe Volunteers', 
     'A volunteer coordination group supporting local charities and service initiatives.', 
     'hello@unityserve.org', 
     'unityserve-logo.png');

-- ============================================
-- PROJECT TABLE
-- ============================================
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (organization_id) REFERENCES organization(organization_id)
);

INSERT INTO project (organization_id, title, description, location, date)
VALUES 
    (1, 'Community Garden Build', 'Build a community garden in downtown area', '123 Main St', '2026-07-15'),
    (1, 'School Playground Renovation', 'Renovate the local elementary school playground', '456 Oak Ave', '2026-08-20'),
    (1, 'Affordable Housing Project', 'Assist in constructing affordable housing units', '789 Pine Rd', '2026-09-10'),
    (1, 'Senior Center Repairs', 'Repair and paint the local senior community center', '321 Maple Dr', '2026-10-05'),
    (1, 'Park Cleanup Initiative', 'Cleanup and beautify the city park', '555 Park Blvd', '2026-11-01'),
    (2, 'Urban Farm Expansion', 'Expand the urban farm with new greenhouses', '789 Elm St', '2026-07-22'),
    (2, 'Community Cooking Classes', 'Teach healthy cooking and nutrition classes', '234 Oak St', '2026-08-15'),
    (2, 'Farmers Market Setup', 'Set up and run a weekly farmers market', '456 Market Ave', '2026-09-05'),
    (2, 'Seed Distribution Program', 'Distribute free seeds to local families', '567 Garden Rd', '2026-09-25'),
    (2, 'Composting Workshop', 'Teach community members how to start composting', '789 Green St', '2026-10-15'),
    (3, 'Food Bank Volunteer Day', 'Sort and pack food donations', '123 Charity Ln', '2026-07-10'),
    (3, 'Homeless Shelter Support', 'Prepare and serve meals at the homeless shelter', '456 Hope St', '2026-08-01'),
    (3, 'School Supply Drive', 'Collect and distribute school supplies', '789 Education Blvd', '2026-08-28'),
    (3, 'Blood Donation Campaign', 'Organize a community blood donation drive', '321 Health Dr', '2026-09-18'),
    (3, 'Winter Coat Collection', 'Collect and distribute winter coats', '555 Warm St', '2026-10-25');

-- ============================================
-- CATEGORY TABLE
-- ============================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO category (name) VALUES 
    ('Education'),
    ('Environment'),
    ('Community Development'),
    ('Health & Wellness'),
    ('Housing & Shelter');

-- ============================================
-- PROJECT-CATEGORY JUNCTION TABLE
-- ============================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE
);

INSERT INTO project_category (project_id, category_id) VALUES
    -- BrightFuture Builders projects (1-5)
    (1, 2), (1, 3),
    (2, 1),
    (3, 5),
    (4, 3),
    (5, 2), (5, 3),
    -- GreenHarvest Growers projects (6-10)
    (6, 2), (6, 3),
    (7, 4),
    (8, 3),
    (9, 1),
    (10, 2), (10, 1),
    -- UnityServe Volunteers projects (11-15)
    (11, 3),
    (12, 5),
    (13, 1),
    (14, 4),
    (15, 3), (15, 5);

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Organizations:' as "Check", COUNT(*) as count FROM organization
UNION ALL
SELECT 'Projects:', COUNT(*) FROM project
UNION ALL
SELECT 'Categories:', COUNT(*) FROM category
UNION ALL
SELECT 'Project-Category links:', COUNT(*) FROM project_category;