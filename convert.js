import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvPath = path.join(__dirname, 'src', 'data', 'compradores.csv');
const jsPath = path.join(__dirname, 'src', 'data', 'compradoresData.js');

const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Simple CSV parser that handles quotes
function parseCSV(text) {
  const result = [];
  let row = [];
  let inQuotes = false;
  let currentVal = '';
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    
    if (char === '"') {
      if (inQuotes && text[i+1] === '"') {
        currentVal += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentVal.trim());
      currentVal = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(currentVal.trim());
      result.push(row);
      row = [];
      currentVal = '';
    } else if (char !== '\r') {
      currentVal += char;
    }
  }
  
  if (currentVal || row.length > 0) {
    row.push(currentVal.trim());
    result.push(row);
  }
  
  return result;
}

const parsed = parseCSV(csvContent);
// Remove header
const data = parsed.slice(1).filter(row => row.length > 1);

const jsContent = `export const COMPRADORES_RAW = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(jsPath, jsContent);
console.log('Data converted successfully!');
