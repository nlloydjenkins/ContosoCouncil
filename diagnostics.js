// This is a temporary diagnostic file to help fix the issues in ApplicationStatusModal.tsx
console.log('Starting diagnostic...');

// Find the parse errors in the file
console.log('Checking for regex issues...');

// Test the numbered format regex
const testRegex = /- \*\*(.*?)\*\*:\s*(.*?)(?=\n\s*- \*\*|\n\d+\. \*\*|\n\n|$)/gs;

const testString = `1. **Design and Access Statement**
   - **Design Rationale**: Description 1
   - **Materials and Appearance**: Description 2

2. **Planning Statement**
   - **Summary**: Description 3`;

console.log('Test string:', testString);

let match;
console.log('Matches:');
while ((match = testRegex.exec(testString)) !== null) {
  console.log(`Found match: ${match[1]} - ${match[2]}`);
}

// Check the structure
console.log('\nChecking component structure...');

const parseSource = (source) => {
  const functionDefRegex = /(\w+)\s*=\s*(\([^)]*\))\s*=>\s*{/g;
  let match;
  console.log('Functions found:');
  while ((match = functionDefRegex.exec(source)) !== null) {
    console.log(`${match[1]} - ${match[2]}`);
  }
  
  const returnStatementRegex = /return\s+(?!items)([^;]*);/g;
  match = null;
  console.log('\nReturn statements found:');
  while ((match = returnStatementRegex.exec(source)) !== null) {
    console.log(`Return: ${match[1]}`);
  }
};

// Sample of the component structure
const componentStructure = `
const ApplicationStatusModal: React.FC<ApplicationStatusModalProps> = ({
  open,
  onClose,
  applicationRef = '10001'
}) => {
  // State variables...
  
  // Helper functions
  const parseApplicationData = (responseText: string) => {
    const extractGuidance = (docName: string, responseText: string) => {
      // Implementation...
      return items;
    };
    
    const documents: DocumentItem[] = [
      // Document items...
    ];
    
    return documents;
  };
  
  // Other functions...
  
  return (
    <Dialog>
      {/* Component JSX */}
    </Dialog>
  );
};

export default ApplicationStatusModal;
`;

parseSource(componentStructure);

console.log('\nDiagnostic complete.');
