import { promises as fs } from 'fs';
import { createConnection } from '$lib/database/mysql.js';
 
export async function load (){
    const connection = await createConnection();
    const [rows] =  await connection.execute('SELECT * FROM schools;');
 
return {
    schulen : rows
}
 
}