/**
 * Safe client-side file parser for TXT, Markdown, and PDF study notes.
 * Fails gracefully and advises user if binary extraction is not clean.
 */

export interface ParsedFileResult {
  text: string;
  filename: string;
  success: boolean;
  warning?: string;
}

export async function parseUploadedFile(file: File): Promise<ParsedFileResult> {
  const filename = file.name;
  const extension = filename.split('.').pop()?.toLowerCase();

  // Plain text / Markdown / Source files
  if (extension === 'txt' || extension === 'md' || extension === 'rst' || extension === 'markdown' || file.type.startsWith('text/')) {
    try {
      const text = await file.text();
      return {
        text: text.trim(),
        filename,
        success: true
      };
    } catch {
      return {
        text: '',
        filename,
        success: false,
        warning: 'Failed to read the text file. Please try pasting the content directly.'
      };
    }
  }

  // PDF handling
  if (extension === 'pdf' || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      
      // Decode binary string and search for text objects (BT ... ET)
      let rawString = '';
      for (let i = 0; i < uint8.length; i++) {
        // Sample standard ASCII characters
        const charCode = uint8[i];
        if (charCode >= 32 && charCode <= 126) {
          rawString += String.fromCharCode(charCode);
        } else if (charCode === 10 || charCode === 13 || charCode === 9) {
          rawString += ' ';
        }
      }

      // Extract text inside PDF stream parentheses: (text) Tj or [(text)] TJ
      const textMatches: string[] = [];
      const regex = /\(([^)]+)\)\s*(?:Tj|'|")/g;
      let match;
      while ((match = regex.exec(rawString)) !== null) {
        if (match[1] && match[1].length > 1 && !match[1].startsWith('/')) {
          textMatches.push(match[1]);
        }
      }

      const extracted = textMatches.join(' ').replace(/\\([()\\])/g, '$1').trim();

      if (extracted.length > 100) {
        return {
          text: extracted,
          filename,
          success: true
        };
      } else {
        // If the PDF is compressed / flate-encoded or scanned
        return {
          text: '',
          filename,
          success: false,
          warning: 'This PDF uses compressed or scanned pages. Please paste your notes directly into the text box for 100% precision.'
        };
      }
    } catch (err) {
      console.error('PDF parsing error:', err);
      return {
        text: '',
        filename,
        success: false,
        warning: 'Could not extract text from this PDF. Please paste your notes into the text area.'
      };
    }
  }

  return {
    text: '',
    filename,
    success: false,
    warning: `Unsupported file format (.${extension}). Please upload a .txt or .pdf file, or paste your notes directly.`
  };
}
