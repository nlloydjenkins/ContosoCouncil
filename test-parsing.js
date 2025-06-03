// Test parsing function with actual agent output format

const testResponse = `The planning application 10001 is missing several required documents and fields based on the requirements document. Here are the missing items:

    Design and Access Statement
        Design Rationale: Provide detailed information about the design rationale. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Materials and Appearance: Provide detailed information about materials and appearance. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Accessibility (if relevant): Provide detailed information about accessibility. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

    Planning Statement
        Summary of Proposed Works: Provide detailed information about the summary of proposed works. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Compliance with Local Policies: Provide detailed information about compliance with local policies. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

    Flood Risk Assessment
        Flood Zone Identification: Provide detailed information about flood zone identification. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Mitigation Measures: Provide detailed information about mitigation measures. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Surface Water Drainage Plan: Provide detailed information about the surface water drainage plan. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

    Heritage Statement
        Description of Heritage Asset: Provide detailed information about the description of the heritage asset. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Impact of Proposal: Provide detailed information about the impact of the proposal. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Justification for Works: Provide detailed information about the justification for works. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

    Tree Survey or Arboricultural Report
        Tree Locations and Species: Provide detailed information about tree locations and species. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Root Protection Areas: Provide detailed information about root protection areas. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Impact of Proposed Work: Provide detailed information about the impact of proposed work. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

    Biodiversity or Ecology Report
        Habitat Impact: Provide detailed information about habitat impact. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Protected Species: Provide detailed information about protected species. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.
        Mitigation Plans: Provide detailed information about mitigation plans. Include all necessary facts, maps, or statements. If a visual element is required (e.g., site outlined in red), use an appropriate scale and annotation.

You can find the templates for these documents below:

<list of document links>

Please ensure that all required fields and documents are completed accurately to avoid any delays in the planning application process.`;

const extractGuidance = (docName, responseText) => {
  console.log(`Extracting guidance for: "${docName}"`);
  console.log(`Response text length: ${responseText.length}`);
  
  // Try new format first (indented bullet points)
  const sectionRegex = new RegExp(`${docName}\\s*\\n([\\s\\S]*?)(?=\\n\\s{4}[A-Z]|\\n[A-Z]|$)`, 'i');
  const match = responseText.match(sectionRegex);
  
  if (!match) {
    console.log(`No match found for "${docName}" in new format`);
    // Fallback to old format
    const oldSectionRegex = new RegExp(`### ${docName}\\s*([\\s\\S]*?)(?=### |$)`, 'i');
    const oldMatch = responseText.match(oldSectionRegex);
    if (oldMatch) {
      console.log(`Found match for "${docName}" in old format`);
      const content = oldMatch[1];
      const items = [];
      
      // Extract bullet points with their details (old format)
      const bulletRegex = /- \*\*(.*?)\*\*:\s*(.*?)(?=\n- \*\*|\n###|\n\n|$)/gs;
      let bulletMatch;
      while ((bulletMatch = bulletRegex.exec(content)) !== null) {
        const title = bulletMatch[1].trim();
        const description = bulletMatch[2].replace(/\n/g, ' ').trim();
        items.push(`${title}: ${description}`);
      }
      console.log(`Extracted ${items.length} items from old format:`, items);
      return items;
    }
    console.log(`No match found for "${docName}" in either format`);
    return [];
  }
  
  console.log(`Found match for "${docName}" in new format`);
  const content = match[1];
  console.log(`Content for "${docName}":`, content);
  const items = [];
  
  // Extract indented bullet points with their details
  const bulletRegex = /^\s{8}([^:]+):\s*(.*?)(?=\n\s{8}|\n\s{4}|\n[A-Z]|\n\nYou can find|$)/gms;
  let bulletMatch;
  while ((bulletMatch = bulletRegex.exec(content)) !== null) {
    const title = bulletMatch[1].trim();
    const description = bulletMatch[2].replace(/\n/g, ' ').trim();
    items.push(`${title}: ${description}`);
  }
  
  console.log(`Extracted ${items.length} items from new format:`, items);
  return items;
};

// Test with specific documents
console.log('\n=== Testing Design and Access Statement ===');
const designResults = extractGuidance('Design and Access Statement', testResponse);
console.log('Results:', designResults);

console.log('\n=== Testing Planning Statement ===');
const planningResults = extractGuidance('Planning Statement', testResponse);
console.log('Results:', planningResults);

console.log('\n=== Testing Heritage Statement ===');
const heritageResults = extractGuidance('Heritage Statement', testResponse);
console.log('Results:', heritageResults);
