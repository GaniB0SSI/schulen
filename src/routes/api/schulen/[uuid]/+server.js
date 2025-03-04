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

// GET: Fetch a specific school by UUID
export async function GET({ params }) {
    const { uuid } = params;
    let connection;

    try {
        connection = await createConnection();
        const [rows] = await connection.execute('SELECT * FROM schools WHERE id = ?;', [uuid]);
        const school = rows[0];

        if (!school) {
            return new Response(JSON.stringify({ error: 'School not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(school), {
            status: 200,
            headers: { 'content-type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Database query failed', details: error.message }), { status: 500 });
    }
}

// PUT: Update a school’s details
export async function PUT({ params, request }) {
    const { uuid } = params;
    const data = await request.json();
    let connection;
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    try {
        connection = await createConnection();

        const [result] = await connection.execute(
            `UPDATE schools
            SET
                name = COALESCE(?, name),
                address = COALESCE(?, address),
                phone_number = COALESCE(?, phone_number),
                email = COALESCE(?, email),
                director_name = COALESCE(?, director_name),
                established_year = COALESCE(?, established_year)
            WHERE id = ?;`,
            [
                data.name ?? null,
                data.address ?? null,
                data.phone_number ?? null,
                data.email ?? null,
                data.director_name ?? null,
                data.established_year ?? null,
                uuid
            ]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'School not found or no changes made' }), { status: 404 });
        }

        const [updatedSchool] = await connection.execute(
            'SELECT * FROM schools WHERE id = ?;',
            [uuid]
        );

        return new Response(JSON.stringify(updatedSchool[0]), {
            status: 200,
            headers: { 'content-type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to update school', details: error.message }), { status: 500 });
    } 
}

// DELETE: Remove a school by UUID
export async function DELETE({ params , 
    request }) {
    const { uuid } = params;
    let connection;
    const authResponse = await authenticate(request);
    if (authResponse) return authResponse;

    try {
        connection = await createConnection();

        const [result] = await connection.execute(
            'DELETE FROM schools WHERE id = ?;',
            [uuid]
        );

        if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: 'School not found' }), { status: 404 });
        }

        return new Response(null, { status: 204 }); // 204 = No Content (successful delete)

    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to delete school', details: error.message }), { status: 500 });
    } 
}
