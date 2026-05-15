import pool, { query } from './db';

// Anggota (Members)
export async function getAllAnggota() {
  const result = await query('SELECT * FROM anggota ORDER BY created_at DESC');
  return result.rows;
}

export async function getAnggotaById(id: string) {
  const result = await query('SELECT * FROM anggota WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createAnggota(data: any) {
  const { id, name, phone, position, email, join_date, is_admin } = data;
  const result = await query(
    `INSERT INTO anggota (id, name, phone, position, email, join_date, is_admin, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [id, name, phone, position, email, join_date, is_admin, data.created_at, data.updated_at]
  );
  return result.rows[0];
}

export async function updateAnggota(id: string, data: any) {
  const { name, phone, position, email, join_date, is_admin, updated_at } = data;
  const result = await query(
    `UPDATE anggota 
     SET name = $1, phone = $2, position = $3, email = $4, join_date = $5, is_admin = $6, updated_at = $7
     WHERE id = $8
     RETURNING *`,
    [name, phone, position, email, join_date, is_admin, updated_at, id]
  );
  return result.rows[0] || null;
}

export async function deleteAnggota(id: string) {
  const result = await query('DELETE FROM anggota WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}

// Artikel (Articles)
export async function getAllArtikel() {
  const result = await query('SELECT * FROM artikel ORDER BY created_at DESC');
  return result.rows;
}

export async function getArtikelById(id: string) {
  const result = await query('SELECT * FROM artikel WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createArtikel(data: any) {
  const { id, title, paragraph, images, author, role, publish_date } = data;
  const result = await query(
    `INSERT INTO artikel (id, title, paragraph, images, author, role, publish_date, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [id, title, paragraph, JSON.stringify(images || []), author, role, publish_date, data.created_at, data.updated_at]
  );
  return result.rows[0];
}

export async function updateArtikel(id: string, data: any) {
  const { title, paragraph, images, author, role, publish_date, updated_at } = data;
  const result = await query(
    `UPDATE artikel 
     SET title = $1, paragraph = $2, images = $3, author = $4, role = $5, publish_date = $6, updated_at = $7
     WHERE id = $8
     RETURNING *`,
    [title, paragraph, JSON.stringify(images || []), author, role, publish_date, updated_at, id]
  );
  return result.rows[0] || null;
}

export async function deleteArtikel(id: string) {
  const result = await query('DELETE FROM artikel WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}

// Berita (News)
export async function getAllBerita() {
  const result = await query('SELECT * FROM berita ORDER BY created_at DESC');
  return result.rows;
}

export async function getBeritaById(id: string) {
  const result = await query('SELECT * FROM berita WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createBerita(data: any) {
  const { id, title, content, category, date, author, role } = data;
  const result = await query(
    `INSERT INTO berita (id, title, content, category, date, author, role, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [id, title, content, category, date, author, role, data.created_at, data.updated_at]
  );
  return result.rows[0];
}

export async function updateBerita(id: string, data: any) {
  const { title, content, category, date, author, role, updated_at } = data;
  const result = await query(
    `UPDATE berita 
     SET title = $1, content = $2, category = $3, date = $4, author = $5, role = $6, updated_at = $7
     WHERE id = $8
     RETURNING *`,
    [title, content, category, date, author, role, updated_at, id]
  );
  return result.rows[0] || null;
}

export async function deleteBerita(id: string) {
  const result = await query('DELETE FROM berita WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}

// Kegiatan (Activities)
export async function getAllKegiatan() {
  const result = await query('SELECT * FROM kegiatan ORDER BY date DESC');
  return result.rows;
}

export async function getKegiatanById(id: string) {
  const result = await query('SELECT * FROM kegiatan WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createKegiatan(data: any) {
  const { id, title, description, date, time, locations, status, featured, hero_title, hero_subtitle, hero_quote, about_section, registration_link, ticket_price, max_participants, contact_person, contact_phone, sponsors, media_partners } = data;
  const result = await query(
    `INSERT INTO kegiatan (
      id, title, description, date, time, locations, status, featured, 
      hero_title, hero_subtitle, hero_quote, about_section, registration_link, 
      ticket_price, max_participants, contact_person, contact_phone, sponsors, media_partners
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
    RETURNING *`,
    [
      id, title, description, date, time, JSON.stringify(locations || []), status, featured,
      hero_title, hero_subtitle, hero_quote, JSON.stringify(about_section || {}), registration_link,
      ticket_price, max_participants, contact_person, contact_phone, JSON.stringify(sponsors || []), JSON.stringify(media_partners || [])
    ]
  );
  return result.rows[0];
}

export async function updateKegiatan(id: string, data: any) {
  const { title, description, date, time, locations, status, featured, hero_title, hero_subtitle, hero_quote, about_section, registration_link, ticket_price, max_participants, contact_person, contact_phone, sponsors, media_partners } = data;
  const result = await query(
    `UPDATE kegiatan 
     SET title = $1, description = $2, date = $3, time = $4, locations = $5, status = $6, featured = $7,
         hero_title = $8, hero_subtitle = $9, hero_quote = $10, about_section = $11, registration_link = $12,
         ticket_price = $13, max_participants = $14, contact_person = $15, contact_phone = $16, sponsors = $17, media_partners = $18
     WHERE id = $19
     RETURNING *`,
    [
      title, description, date, time, JSON.stringify(locations || []), status, featured,
      hero_title, hero_subtitle, hero_quote, JSON.stringify(about_section || {}), registration_link,
      ticket_price, max_participants, contact_person, contact_phone, JSON.stringify(sponsors || []), JSON.stringify(media_partners || []), id
    ]
  );
  return result.rows[0] || null;
}

export async function deleteKegiatan(id: string) {
  const result = await query('DELETE FROM kegiatan WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}

// Notulensi (Meeting Minutes)
export async function getAllNotulensi() {
  const result = await query('SELECT * FROM notulensi ORDER BY date DESC');
  return result.rows;
}

export async function getNotulensiById(id: string) {
  const result = await query('SELECT * FROM notulensi WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function createNotulensi(data: any) {
  const { id, date, title, content, created_by } = data;
  const result = await query(
    `INSERT INTO notulensi (id, date, title, content, created_by, created_at, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [id, date, title, content, created_by, data.created_at, data.updated_at]
  );
  return result.rows[0];
}

export async function updateNotulensi(id: string, data: any) {
  const { date, title, content, created_by, updated_at } = data;
  const result = await query(
    `UPDATE notulensi 
     SET date = $1, title = $2, content = $3, created_by = $4, updated_at = $5
     WHERE id = $6
     RETURNING *`,
    [date, title, content, created_by, updated_at, id]
  );
  return result.rows[0] || null;
}

export async function deleteNotulensi(id: string) {
  const result = await query('DELETE FROM notulensi WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}
