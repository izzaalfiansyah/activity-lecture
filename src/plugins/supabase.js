import { createClient } from '@supabase/supabase-js';

const url = 'https://aufjwsnlvujakybldbrv.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODM1NzIxMCwiZXhwIjoxOTUzOTMzMjEwfQ.-oFVkC-f5vmlVbe_fW-VUA9f-m0m4sFy7KvPF19Hx_4';

const supabase = createClient(url, key);

export default supabase;