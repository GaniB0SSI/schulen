import pool from '$lib/database/mysql.js';

export const GET = async () => {
    try {
        const [rows] = await pool.query('SELECT * FROM Rivers');
        return new Response(JSON.stringify(rows), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
};

export const POST = async ({ request }) => {
    try {
        const { name, length_km, source, mouth, description } = await request.json();
        await pool.query(
            'INSERT INTO Rivers (name, length_km, source, mouth, description) VALUES (?, ?, ?, ?, ?)',
            [name, length_km, source, mouth, description]
        );
        return new Response(JSON.stringify({ message: 'River added' }), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
};

export const DELETE = async ({ request }) => {
    try {
        const { id } = await request.json();
        await pool.query('DELETE FROM Rivers WHERE id = ?', [id]);
        return new Response(JSON.stringify({ message: 'River deleted' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 });
    }
};
