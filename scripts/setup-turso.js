const { createClient } = require('@libsql/client');
const fs = require('fs');
require('dotenv').config();

const client = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Lee el archivo y saca el BOM si existe
let sql = fs.readFileSync('schema.sql', 'utf8');
if (sql.charCodeAt(0) === 0xFEFF) {
    sql = sql.slice(1);
}

// Separa por ; pero ignora lineas vacías y comentarios
const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--'));

async function run() {
    console.log('Conectando a Turso...');
    try {
        for (const stmt of statements) {
            await client.execute(stmt);
            console.log('OK:', stmt.substring(0, 60).replace(/\n/g, ' '));
        }
        console.log('\n✅ Listo. Todas las tablas creadas en Turso.');
    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('Statement que falló:', error.cause);
    }
}

run();