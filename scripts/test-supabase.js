const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hzldgvdtgkebfotpkjpt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh6bGRndmR0Z2tlYmZvdHBranB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MzAxNzksImV4cCI6MjA4OTAwNjE3OX0.wKOxM5AXpt-rBDzQ7LqGbu5OU1bnxsgJpbpTs0HBH7M';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing Supabase Table...");
  
  // Test Insert
  const { data: insertData, error: insertError } = await supabase
    .from('user_progress')
    .insert([{ username: 'test_node_student', completed_pages: {} }])
    .select();
    
  if (insertError) {
    console.error("Insert Error:", insertError);
  } else {
    console.log("Insert Success:", insertData);
  }
  
  // Test Select
  const { data: selectData, error: selectError } = await supabase
    .from('user_progress')
    .select('*');
    
  if (selectError) {
    console.error("Select Error:", selectError);
  } else {
    console.log("Select Success:", selectData);
  }
}

test();
