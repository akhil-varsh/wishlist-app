const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;



const supabase = createClient(supabaseUrl, supabaseKey);
if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase credentials. Please check your .env file.');
}

module.exports = supabase;
