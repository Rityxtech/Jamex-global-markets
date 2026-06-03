import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zkpfypqjesgwtwczywje.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InprcGZ5cHFqZXNnd3R3Y3p5d2plIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0NDMzMzEsImV4cCI6MjA5NjAxOTMzMX0.gHf4p_GgmdusAeu8RlKjGdsStEESkan1UN6gG05lh_Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
