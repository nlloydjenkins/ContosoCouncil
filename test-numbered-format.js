// Test parsing function with new // Extract bullet points with their details (numbered list format)
    const bulletRegex = /- \*\*(.*?)\*\*:\s*(.*?)(?=\n\s*- \*\*|\n\d+\. \*\*|\n\n|$)/gs;

const testResponse = `The planning application 010001 is missing several required documents and fields based on the requirements document. Here are the missing items:

1. **Design and Access Statement**
   - **Design Rationale**: Provide detailed information about the design rationale. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
   - **Materials and Appearance**: Provide detailed information about materials and appearance. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
   - **Accessibility (if relevant)**: Provide detailed information about accessibility. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

2. **Planning Statement**
   - **Summary of Proposed Works**: Provide detailed information about the summary of proposed works. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
   - **Compliance with Local Policies**: Provide detailed information about compliance with local policies. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

3. **Flood Risk Assessment**
   - **Flood Zone Identification**: Provide detailed information about flood zone identification. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
   - **Mitigation Measures**: Provide detailed information about mitigation measures. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
   - **Surface Water Drainage Plan**: Provide detailed information about the surface water drainage plan. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

You can find the templates for these documents in the provided links.`;

const extractGuidance = (docName, responseText) => {
  console.log(`Extracting guidance for: "${docName}"`);
  console.log(`Response text length: ${responseText.length}`);
  
  // Try numbered list format with bold text first
  const numberedRegex = new RegExp(`\\d+\\. \\*\\*${docName}\\*\\*([\\s\\S]*?)(?=\\d+\\. \\*\\*|You can find|$)`, 'i');
  const numberedMatch = responseText.match(numberedRegex);
  
  if (numberedMatch) {
    console.log(`Found match for "${docName}" in numbered list format`);
    const content = numberedMatch[1];
    console.log(`Content for "${docName}":`, content);
    const items = [];
    
    // Extract bullet points with their details (numbered list format)
    const bulletRegex = /- \*\*(.*?)\*\*:\s*(.*?)(?=\n\s*- \*\*|\n\d+\. \*\*|\n\n|$)/gs;
    let bulletMatch;
    while ((bulletMatch = bulletRegex.exec(content)) !== null) {
      const title = bulletMatch[1].trim();
      const description = bulletMatch[2].replace(/\n/g, ' ').trim();
      items.push(`${title}: ${description}`);
    }
    console.log(`Extracted ${items.length} items from numbered list format:`, items);
    return items;
  }
  
  console.log(`No match found for "${docName}" in numbered list format`);
  return [];
};

// Test with specific documents
console.log('\n=== Testing Design and Access Statement ===');
const designResults = extractGuidance('Design and Access Statement', testResponse);
console.log('Results:', designResults);

console.log('\n=== Testing Planning Statement ===');
const planningResults = extractGuidance('Planning Statement', testResponse);
console.log('Results:', planningResults);

console.log('\n=== Testing Flood Risk Assessment ===');
const floodResults = extractGuidance('Flood Risk Assessment', testResponse);
console.log('Results:', floodResults);
