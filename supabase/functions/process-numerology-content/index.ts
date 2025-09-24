import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NumerologyContent {
  topico: string;
  [key: string]: any;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting numerology content processing');

    // Get Supabase credentials from environment
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the uploaded file from the request
    const formData = await req.formData();
    const zipFile = formData.get('file') as File;
    
    if (!zipFile) {
      throw new Error('No file uploaded');
    }

    console.log(`Processing ZIP file: ${zipFile.name}, size: ${zipFile.size} bytes`);

    // Convert file to array buffer
    const zipBuffer = await zipFile.arrayBuffer();
    
    // Import JSZip
    const JSZip = (await import("https://esm.sh/jszip@3.10.1")).default;
    const zip = new JSZip();
    
    // Load the ZIP file
    const zipContent = await zip.loadAsync(zipBuffer);
    
    console.log('ZIP file loaded successfully');
    
    const processedFiles: string[] = [];
    const errors: string[] = [];

    // Process each JSON file in the ZIP
    for (const [filename, file] of Object.entries(zipContent.files)) {
      if (file.dir || !filename.endsWith('.json')) {
        continue; // Skip directories and non-JSON files
      }

      try {
        console.log(`Processing file: ${filename}`);
        
        // Extract file content
        const content = await file.async('text');
        
        // Parse JSON
        const jsonData: NumerologyContent = JSON.parse(content);
        
        // Extract topic from filename (e.g., "motivacao/motivacao_01.json" -> "motivacao_01")
        const pathParts = filename.split('/');
        const filenamePart = pathParts[pathParts.length - 1]; // Get just the filename
        const topico = filenamePart.replace('.json', ''); // Remove .json extension
        
        console.log(`Auto-generated topic: ${topico} for file: ${filename}`);

        // Insert into Supabase with auto-generated topic
        const { error: insertError } = await supabase
          .from('conteudos_numerologia')
          .insert({
            topico: topico,
            conteudo: jsonData
          });

        if (insertError) {
          console.error(`Error inserting ${filename}:`, insertError);
          errors.push(`File ${filename}: ${insertError.message}`);
        } else {
          processedFiles.push(filename);
          console.log(`Successfully processed: ${filename} as topic: ${topico}`);
        }

      } catch (error) {
        console.error(`Error processing ${filename}:`, error);
        errors.push(`File ${filename}: ${error.message}`);
      }
    }

    const result = {
      success: true,
      message: `Processed ${processedFiles.length} files successfully`,
      processedFiles,
      errors: errors.length > 0 ? errors : undefined,
      totalFiles: processedFiles.length,
      errorCount: errors.length
    };

    console.log('Processing completed:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-numerology-content function:', error);
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message,
      message: 'Failed to process numerology content'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});