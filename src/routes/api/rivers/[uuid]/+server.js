import pool from '$lib/database/mysql.js';

// GET method: Retrieve a specific river by ID
export async function GET({ params }) {
    try {
        const { uuid } = params;
        const [rows] = await pool.execute('SELECT * FROM Rivers WHERE id = ?', [uuid]);

        if (rows.length === 0) {
            return new Response(JSON.stringify({ error: 'River not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(rows[0]), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
}

// POST method: Add a new river
export async function POST({ request }) {
    try {
        const { name, length_km, source, mouth, description } = await request.json();
        
        if (!name || !length_km || !source || !mouth || !description) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }

        await pool.execute('INSERT INTO Rivers (name, length_km, source, mouth, description) VALUES (?, ?, ?, ?, ?)', 
                           [name, length_km, source, mouth, description]);

        return new Response(JSON.stringify({ message: 'River added successfully' }), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
}

// PUT method: Update an existing river by ID
export async function PUT({ params, request }) {
    try {
        const { uuid } = params;
        const { name, length_km, source, mouth, description } = await request.json();

        if (!name || !length_km || !source || !mouth || !description) {
            return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
        }

        const [result] = await pool.execute(
            'UPDATE Rivers SET name = ?, length_km = ?, source = ?, mouth = ?, description = ? WHERE id = ?', 
            [name, length_km, source, mouth, description, uuid]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'River not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'River updated successfully' }));
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
}

// DELETE method: Remove a river by ID
export async function DELETE({ params }) {
    try {
        const { uuid } = params;
        const [result] = await pool.execute('DELETE FROM Rivers WHERE id = ?', [uuid]);

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'River not found' }), { status: 404 });
        }

        return new Response(JSON.stringify({ message: 'River deleted successfully' }));
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
}
