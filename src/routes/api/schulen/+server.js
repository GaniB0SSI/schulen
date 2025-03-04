import { createConnection } from '$lib/database/mysql.js';
import { BASIC_AUTH_USER, BASIC_AUTH_PASSWORD } from '$env/static/private';
async function authenticate(request) {
    const auth = request.headers.get('authorization');
    if (!auth || auth !== `Basic ${btoa(`${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}`)}`) {
        return new Response(null, {
            status: 401,
            headers: { 'www-authenticate': 'Basic realm="schulen API"' }
        });
    }
 
    const base64Credentials = auth.split(' ')[1];
    const credentials = atob(base64Credentials);
    const [username, password] = credentials.split(':');
 
    if (username !== BASIC_AUTH_USER || password !== BASIC_AUTH_PASSWORD) {
        return new Response(JSON.stringify({ message: 'Access denied' }), {
            status: 401,
            headers: { 'www-authenticate': 'Basic realm="schulen API"' }
        });
    }
 
    return null;
}

// GET: Fetch all schools or a specific school by UUID
export async function GET({ params }) {
    
    const { uuid } = params;
    let connection;

    try {
        connection = await createConnection();

        let query = 'SELECT * FROM schools';
        let values = [];

        if (uuid) {
            query += ' WHERE id = ?';
            values.push(uuid);
        }

        const [rows] = await connection.execute(query, values);

        return new Response(JSON.stringify(uuid ? rows[0] : rows), {
            status: 200,
            headers: { 'content-type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch schools', details: error.message }), { status: 500 });
    } 
}

// POST: Add a new school
export async function POST({ request }) {
    let connection;
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;
    try {
        const data = await request.json();
        connection = await createConnection();

        const [result] = await connection.execute(
            'INSERT INTO schools (name, address, phone_number, email, director_name, established_year) VALUES (?, ?, ?, ?, ?, ?)',
            [data.name, data.address, data.phone_number, data.email, data.director_name, data.established_year]
        );

        const newSchoolId = result.insertId;
        const [rows] = await connection.execute('SELECT * FROM schools WHERE id = ?', [newSchoolId]);

        return new Response(JSON.stringify(rows[0]), {
            status: 201,
            headers: { 'content-type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to insert school', details: error.message }), {
            status: 500,
            headers: { 'content-type': 'application/json' }
        });
    } 
}
