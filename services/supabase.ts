
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ghiwxdxciblbwwwamqxq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoaXd4ZHhjaWJsYnd3d2FtcXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxOTQ2NzIsImV4cCI6MjA4Mjc3MDY3Mn0.IWMGVBWZVFTFL1BdGzy_3FULkZm4DAZdVbjwSzbJQWs';

export const supabase = createClient(supabaseUrl, supabaseKey);
