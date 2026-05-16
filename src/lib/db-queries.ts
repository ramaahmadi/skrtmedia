import pool, { query } from './db';

// Anggota (Members)
export async function getAllAnggota() {
  try {
    const result = await query('SELECT * FROM anggota ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error in getAllAnggota:', error);
    throw error;
  }
}

export async function getAnggotaById(id: string) {
  try {
    const result = await query('SELECT * FROM anggota WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getAnggotaById:', error);
    throw error;
  }
}

export async function createAnggota(data: any) {
  try {
    const { id, name, phone, position, email, join_date, is_admin } = data;
    console.log('Creating anggota with data:', { id, name, phone, position, email, join_date, is_admin });
    const result = await query(
      `INSERT INTO anggota (id, name, phone, position, email, join_date, is_admin, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, name, phone, position, email, join_date, is_admin, data.created_at, data.updated_at]
    );
    console.log('Anggota created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createAnggota:', error);
    throw error;
  }
}

export async function updateAnggota(id: string, data: any) {
  try {
    const { name, phone, position, email, join_date, is_admin, updated_at } = data;
    console.log('Updating anggota with id:', id, 'data:', { name, phone, position, email, join_date, is_admin });
    const result = await query(
      `UPDATE anggota 
       SET name = $1, phone = $2, position = $3, email = $4, join_date = $5, is_admin = $6, updated_at = $7
       WHERE id = $8
       RETURNING *`,
      [name, phone, position, email, join_date, is_admin, updated_at, id]
    );
    console.log('Anggota updated successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in updateAnggota:', error);
    throw error;
  }
}

export async function deleteAnggota(id: string) {
  try {
    console.log('Deleting anggota with id:', id);
    const result = await query('DELETE FROM anggota WHERE id = $1 RETURNING *', [id]);
    console.log('Anggota deleted successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in deleteAnggota:', error);
    throw error;
  }
}

// Artikel (Articles)
export async function getAllArtikel() {
  try {
    const result = await query('SELECT * FROM artikel ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error in getAllArtikel:', error);
    throw error;
  }
}

export async function getArtikelById(id: string) {
  try {
    const result = await query('SELECT * FROM artikel WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getArtikelById:', error);
    throw error;
  }
}

export async function createArtikel(data: any) {
  try {
    const { id, title, paragraph, images, author, role, publish_date } = data;
    console.log('Creating artikel with data:', { id, title, author, role, publish_date });
    const result = await query(
      `INSERT INTO artikel (id, title, paragraph, images, author, role, publish_date, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, title, paragraph, JSON.stringify(images || []), author, role, publish_date, data.created_at, data.updated_at]
    );
    console.log('Artikel created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createArtikel:', error);
    throw error;
  }
}

export async function updateArtikel(id: string, data: any) {
  try {
    const { title, paragraph, images, author, role, publish_date, updated_at } = data;
    console.log('Updating artikel with id:', id, 'data:', { title, author, role });
    const result = await query(
      `UPDATE artikel 
       SET title = $1, paragraph = $2, images = $3, author = $4, role = $5, publish_date = $6, updated_at = $7
       WHERE id = $8
       RETURNING *`,
      [title, paragraph, JSON.stringify(images || []), author, role, publish_date, updated_at, id]
    );
    console.log('Artikel updated successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in updateArtikel:', error);
    throw error;
  }
}

export async function deleteArtikel(id: string) {
  try {
    console.log('Deleting artikel with id:', id);
    const result = await query('DELETE FROM artikel WHERE id = $1 RETURNING *', [id]);
    console.log('Artikel deleted successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in deleteArtikel:', error);
    throw error;
  }
}

// Berita (News)
export async function getAllBerita() {
  try {
    const result = await query('SELECT * FROM berita ORDER BY created_at DESC');
    return result.rows;
  } catch (error) {
    console.error('Error in getAllBerita:', error);
    throw error;
  }
}

export async function getBeritaById(id: string) {
  try {
    const result = await query('SELECT * FROM berita WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getBeritaById:', error);
    throw error;
  }
}

export async function createBerita(data: any) {
  try {
    const { id, title, content, category, date, author, role } = data;
    console.log('Creating berita with data:', { id, title, category, author, role });
    const result = await query(
      `INSERT INTO berita (id, title, content, category, date, author, role, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, title, content, category, date, author, role, data.created_at, data.updated_at]
    );
    console.log('Berita created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createBerita:', error);
    throw error;
  }
}

export async function updateBerita(id: string, data: any) {
  try {
    const { title, content, category, date, author, role, updated_at } = data;
    console.log('Updating berita with id:', id, 'data:', { title, category, author });
    const result = await query(
      `UPDATE berita 
       SET title = $1, content = $2, category = $3, date = $4, author = $5, role = $6, updated_at = $7
       WHERE id = $8
       RETURNING *`,
      [title, content, category, date, author, role, updated_at, id]
    );
    console.log('Berita updated successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in updateBerita:', error);
    throw error;
  }
}

export async function deleteBerita(id: string) {
  try {
    console.log('Deleting berita with id:', id);
    const result = await query('DELETE FROM berita WHERE id = $1 RETURNING *', [id]);
    console.log('Berita deleted successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in deleteBerita:', error);
    throw error;
  }
}

// Kegiatan (Activities)
export async function getAllKegiatan() {
  try {
    const result = await query('SELECT * FROM kegiatan ORDER BY date DESC');
    return result.rows;
  } catch (error) {
    console.error('Error in getAllKegiatan:', error);
    throw error;
  }
}

export async function getKegiatanById(id: string) {
  try {
    const result = await query('SELECT * FROM kegiatan WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getKegiatanById:', error);
    throw error;
  }
}

export async function createKegiatan(data: any) {
  try {
    const { id, title, description, date, time, locations, status, featured, hero_title, hero_subtitle, hero_quote, about_section, registration_link, ticket_price, ticket_price_min, ticket_price_max, max_participants, contact_person, contact_phone, sponsors, media_partners } = data;
    console.log('Creating kegiatan with data:', { id, title, date, status, ticket_price_min, ticket_price_max });
    const result = await query(
      `INSERT INTO kegiatan (
        id, title, description, date, time, locations, status, featured, 
        hero_title, hero_subtitle, hero_quote, about_section, registration_link, 
        ticket_price, ticket_price_min, ticket_price_max, max_participants, contact_person, contact_phone, sponsors, media_partners
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
      RETURNING *`,
      [
        id, title, description, date, time, JSON.stringify(locations || []), status, featured,
        hero_title, hero_subtitle, hero_quote, JSON.stringify(about_section || {}), registration_link,
        ticket_price, ticket_price_min, ticket_price_max, max_participants, contact_person, contact_phone, JSON.stringify(sponsors || []), JSON.stringify(media_partners || [])
      ]
    );
    console.log('Kegiatan created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createKegiatan:', error);
    throw error;
  }
}

export async function updateKegiatan(id: string, data: any) {
  try {
    const { title, description, date, time, locations, status, featured, hero_title, hero_subtitle, hero_quote, about_section, registration_link, ticket_price, ticket_price_min, ticket_price_max, max_participants, contact_person, contact_phone, sponsors, media_partners } = data;
    console.log('Updating kegiatan with id:', id, 'data:', { title, date, status, ticket_price_min, ticket_price_max });
    const result = await query(
      `UPDATE kegiatan 
       SET title = $1, description = $2, date = $3, time = $4, locations = $5, status = $6, featured = $7,
           hero_title = $8, hero_subtitle = $9, hero_quote = $10, about_section = $11, registration_link = $12,
           ticket_price = $13, ticket_price_min = $14, ticket_price_max = $15, max_participants = $16, contact_person = $17, contact_phone = $18, sponsors = $19, media_partners = $20
       WHERE id = $21
       RETURNING *`,
      [
        title, description, date, time, JSON.stringify(locations || []), status, featured,
        hero_title, hero_subtitle, hero_quote, JSON.stringify(about_section || {}), registration_link,
        ticket_price, ticket_price_min, ticket_price_max, max_participants, contact_person, contact_phone, JSON.stringify(sponsors || []), JSON.stringify(media_partners || []), id
      ]
    );
    console.log('Kegiatan updated successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in updateKegiatan:', error);
    throw error;
  }
}

export async function deleteKegiatan(id: string) {
  try {
    console.log('Deleting kegiatan with id:', id);
    const result = await query('DELETE FROM kegiatan WHERE id = $1 RETURNING *', [id]);
    console.log('Kegiatan deleted successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in deleteKegiatan:', error);
    throw error;
  }
}

// Notulensi (Meeting Minutes)
export async function getAllNotulensi() {
  try {
    const result = await query('SELECT * FROM notulensi ORDER BY date DESC');
    return result.rows;
  } catch (error) {
    console.error('Error in getAllNotulensi:', error);
    throw error;
  }
}

export async function getNotulensiById(id: string) {
  try {
    const result = await query('SELECT * FROM notulensi WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getNotulensiById:', error);
    throw error;
  }
}

export async function createNotulensi(data: any) {
  try {
    const { id, date, title, content, created_by } = data;
    console.log('Creating notulensi with data:', { id, date, title, created_by });
    const result = await query(
      `INSERT INTO notulensi (id, date, title, content, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [id, date, title, content, created_by, data.created_at, data.updated_at]
    );
    console.log('Notulensi created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createNotulensi:', error);
    throw error;
  }
}

export async function updateNotulensi(id: string, data: any) {
  try {
    const { date, title, content, created_by, updated_at } = data;
    console.log('Updating notulensi with id:', id, 'data:', { date, title, created_by });
    const result = await query(
      `UPDATE notulensi 
       SET date = $1, title = $2, content = $3, created_by = $4, updated_at = $5
       WHERE id = $6
       RETURNING *`,
      [date, title, content, created_by, updated_at, id]
    );
    console.log('Notulensi updated successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in updateNotulensi:', error);
    throw error;
  }
}

export async function deleteNotulensi(id: string) {
  try {
    console.log('Deleting notulensi with id:', id);
    const result = await query('DELETE FROM notulensi WHERE id = $1 RETURNING *', [id]);
    console.log('Notulensi deleted successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in deleteNotulensi:', error);
    throw error;
  }
}

// Pembukuan (Financial Records) functions
export async function getAllPembukuan() {
  try {
    const result = await query('SELECT * FROM pembukuan ORDER BY date DESC');
    return result.rows;
  } catch (error) {
    console.error('Error in getAllPembukuan:', error);
    throw error;
  }
}

export async function getPembukuanById(id: string) {
  try {
    const result = await query('SELECT * FROM pembukuan WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in getPembukuanById:', error);
    throw error;
  }
}

export async function createPembukuan(data: any) {
  try {
    const { id, date, type, category, amount, description, created_by } = data;
    console.log('Creating pembukuan with data:', { id, date, type, category, amount, description, created_by });
    const result = await query(
      `INSERT INTO pembukuan (id, date, type, category, amount, description, created_by, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [id, date, type, category, amount, description, created_by, data.created_at, data.updated_at]
    );
    console.log('Pembukuan created successfully:', result.rows[0]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in createPembukuan:', error);
    throw error;
  }
}

export async function updatePembukuan(id: string, data: any) {
  try {
    const { date, type, category, amount, description, created_by, updated_at } = data;
    console.log('Updating pembukuan with id:', id, 'data:', { date, type, category, amount, description, created_by });
    const result = await query(
      `UPDATE pembukuan 
       SET date = $1, type = $2, category = $3, amount = $4, description = $5, created_by = $6, updated_at = $7
       WHERE id = $8
       RETURNING *`,
      [date, type, category, amount, description, created_by, updated_at, id]
    );
    console.log('Pembukuan updated successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in updatePembukuan:', error);
    throw error;
  }
}

export async function deletePembukuan(id: string) {
  try {
    console.log('Deleting pembukuan with id:', id);
    const result = await query('DELETE FROM pembukuan WHERE id = $1 RETURNING *', [id]);
    console.log('Pembukuan deleted successfully:', result.rows[0]);
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error in deletePembukuan:', error);
    throw error;
  }
}
