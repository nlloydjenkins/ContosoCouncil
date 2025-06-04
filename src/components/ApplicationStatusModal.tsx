import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Close,
  Refresh,
  AccountCircle,
  CheckCircle,
  Error as ErrorIcon,
  Warning,
  Description,
  LocationOn,
  Home,
  Architecture,
  Engineering,
  Nature,
  Water,
  AccountBalance,
  Assignment,
  Info,
  ContentCopy,
} from '@mui/icons-material';
import { DirectLineService } from '../services/directLineService';
import { AuthService } from '../services/authService';

interface ApplicationStatusModalProps {
  open: boolean;
  onClose: () => void;
  applicationRef?: string;
}

const ApplicationStatusModal: React.FC<ApplicationStatusModalProps> = ({
  open,
  onClose,
  applicationRef = '10001',
}) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasPermissionRequest, setHasPermissionRequest] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<any[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [progressMessage, setProgressMessage] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [agentPrompt, setAgentPrompt] = useState<string>('');

  // Interface for document status
  interface DocumentItem {
    name: string;
    status: 'complete' | 'missing' | 'partial';
    icon: React.ReactNode;
    details?: string[];
    missingFields?: string[];
  }

  // Interface for fix section
  interface FixSection {
    title: string;
    items: string[];
  }

  // Parse the bot response to extract structured data
  const parseApplicationData = (responseText: string) => {
    // Helper function to extract guidance for a specific document
    const extractGuidance = (docName: string, responseText: string) => {
      console.log(`Extracting guidance for: "${docName}"`);
      console.log(`Response text length: ${responseText.length}`);

      // Try numbered list format with bold text first
      const numberedRegex = new RegExp(
        `\\d+\\. \\*\\*${docName}\\*\\*([\\s\\S]*?)(?=\\d+\\. \\*\\*|You can find|$)`,
        'i'
      );
      const numberedMatch = responseText.match(numberedRegex);

      if (numberedMatch) {
        console.log(`Found match for "${docName}" in numbered list format`);
        const content = numberedMatch[1];
        console.log(`Content for "${docName}":`, content);
        const items: string[] = [];

        // Extract bullet points with their details (numbered list format)
        const bulletRegex = /- \*\*(.*?)\*\*:\s*(.*?)(?=\n\s*- \*\*|\n\d+\. \*\*|\n\n|$)/gs;
        let bulletMatch;
        while ((bulletMatch = bulletRegex.exec(content)) !== null) {
          const title = bulletMatch[1].trim();
          const description = bulletMatch[2].replace(/\n/g, ' ').trim();
          items.push(`${title}: ${description}`);
        }
        console.log(
          `Extracted ${items.length} items from numbered list format:`,
          items
        );
        return items;
      }

      // Try new format (indented bullet points)
      const sectionRegex = new RegExp(
        `${docName}\\s*\\n([\\s\\S]*?)(?=\\n\\s{4}[A-Z]|\\n[A-Z]|$)`,
        'i'
      );
      const match = responseText.match(sectionRegex);

      if (!match) {
        console.log(`No match found for "${docName}" in new format`);
        // Fallback to old format
        const oldSectionRegex = new RegExp(
          `### ${docName}\\s*([\\s\\S]*?)(?=### |$)`,
          'i'
        );
        const oldMatch = responseText.match(oldSectionRegex);
        if (oldMatch) {
          console.log(`Found match for "${docName}" in old format`);
          const content = oldMatch[1];
          const items: string[] = [];

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
        console.log(`No match found for "${docName}" in any format`);
        return [];
      }

      console.log(`Found match for "${docName}" in new format`);
      const content = match[1];
      console.log(`Content for "${docName}":`, content);
      const items: string[] = [];

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

    const documents: DocumentItem[] = [
      {
        name: 'Application Form',
        status: responseText.includes('Planning Application Form')
          ? 'complete'
          : 'missing',
        icon: <Assignment />,
        details: responseText.includes('John Smith')
          ? [
            'Applicant: John Smith',
            'Site: 12 Garden Lane, Anytown, AT1 2CD',
            'Description: Single-storey rear extension',
            'Certificate A - Sole owner',
          ]
          : undefined,
      },
      {
        name: 'Location Plan',
        status: responseText.includes('Location Plan')
          ? 'complete'
          : 'missing',
        icon: <LocationOn />,
        details: responseText.includes('Map Scale: 1:1250')
          ? [
            'Scale: 1:1250',
            'North Arrow: Present',
            'Site outlined in red',
            'Includes surrounding roads',
          ]
          : undefined,
      },
      {
        name: 'Block/Site Plan',
        status: responseText.includes('Block Plan')
          ? 'complete'
          : 'missing',
        icon: <Architecture />,
        details: responseText.includes('Map Scale: 1:200')
          ? [
            'Scale: 1:200',
            'Extension: 4m x 6m highlighted',
            'North Arrow: Present',
          ]
          : undefined,
      },
      {
        name: 'Elevations',
        status: responseText.includes('Elevations')
          ? 'complete'
          : 'missing',
        icon: <Home />,
        details: responseText.includes('Scale: 1:100') && responseText.includes('Height')
          ? [
            'Scale: 1:100',
            'Height: 3.2m',
            'Materials: Brick to match existing',
            'Front, Rear, and Side elevations',
          ]
          : undefined,
      },
      {
        name: 'Floor Plans',
        status: responseText.includes('Floor Plans')
          ? 'complete'
          : 'missing',
        icon: <Engineering />,
        details: responseText.includes('Existing Layout')
          ? [
            'Scale: 1:100',
            'Existing: Kitchen, Living Room, Bathroom',
            'Proposed: Added Dining Area to Rear',
          ]
          : undefined,
      },
      {
        name: 'Ownership Certificate',
        status: responseText.includes('Ownership Certificate')
          ? 'complete'
          : 'missing',
        icon: <AccountBalance />,
        details: responseText.includes('Certificate A')
          ? [
            'Certificate A: Sole owner',
            'Signed: John Smith',
            'Date: 30/05/2025',
          ]
          : undefined,
      },
      {
        name: 'Agricultural Holdings Certificate',
        status: responseText.includes('Agricultural Holdings Certificate')
          ? 'complete'
          : 'missing',
        icon: <Nature />,
        details: responseText.includes('not part of an agricultural holding')
          ? [
            'Not part of agricultural holding',
            'Signed: John Smith',
            'Date: 30/05/2025',
          ]
          : undefined,
      },
      {
        name: 'CIL Form 1',
        status: responseText.includes('CIL Form 1')
          ? 'complete'
          : 'missing',
        icon: <Description />,
        details: responseText.includes('Planning Application No: 10001')
          ? [
            'Application No: 10001',
            'Existing Floor Area: 100 sqm',
            'Proposed Floor Area: 120 sqm',
            'Development Type: Domestic Extension',
          ]
          : undefined,
      },
      {
        name: 'Design and Access Statement',
        status: responseText.includes('Design and Access Statement') && responseText.includes('missing')
          ? 'missing'
          : 'complete',
        icon: <Info />,
        missingFields: extractGuidance('Design and Access Statement', responseText).length > 0
          ? extractGuidance('Design and Access Statement', responseText)
          : ['Design Rationale', 'Materials and Appearance', 'Accessibility (if relevant)'],
      },
      {
        name: 'Planning Statement',
        status: responseText.includes('Planning Statement') && responseText.includes('missing')
          ? 'missing'
          : 'complete',
        icon: <Description />,
        missingFields: extractGuidance('Planning Statement', responseText).length > 0
          ? extractGuidance('Planning Statement', responseText)
          : ['Summary of Proposed Works', 'Compliance with Local Policies'],
      },
      {
        name: 'Flood Risk Assessment',
        status: responseText.includes('Flood Risk Assessment') && responseText.includes('missing')
          ? 'missing'
          : 'complete',
        icon: <Water />,
        missingFields: extractGuidance('Flood Risk Assessment', responseText).length > 0
          ? extractGuidance('Flood Risk Assessment', responseText)
          : ['Flood Zone Identification', 'Mitigation Measures', 'Surface Water Drainage Plan'],
      },
      {
        name: 'Heritage Statement',
        status: responseText.includes('Heritage Statement') && responseText.includes('missing')
          ? 'missing'
          : 'complete',
        icon: <AccountBalance />,
        missingFields: extractGuidance('Heritage Statement', responseText).length > 0
          ? extractGuidance('Heritage Statement', responseText)
          : ['Description of Heritage Asset', 'Impact of Proposal', 'Justification for Works'],
      },
      {
        name: 'Tree Survey or Arboricultural Report',
        status: responseText.includes('Tree Survey') && responseText.includes('missing')
          ? 'missing'
          : 'complete',
        icon: <Nature />,
        missingFields: extractGuidance('Tree Survey or Arboricultural Report', responseText).length > 0
          ? extractGuidance('Tree Survey or Arboricultural Report', responseText)
          : ['Tree Locations and Species', 'Root Protection Areas', 'Impact of Proposed Work'],
      },
      {
        name: 'Biodiversity or Ecology Report',
        status: responseText.includes('Biodiversity') && responseText.includes('missing')
          ? 'missing'
          : 'complete',
        icon: <Nature />,
        missingFields: extractGuidance('Biodiversity or Ecology Report', responseText).length > 0
          ? extractGuidance('Biodiversity or Ecology Report', responseText)
          : ['Habitat Impact', 'Protected Species', 'Mitigation Plans'],
      },
    ];

    return documents;
  };  // Parse the "How to Fix" section from agent output
  const parseHowToFixSection = (agentOutput: string): FixSection[] => {
    const lines = agentOutput.split('\n');
    const fixSections: FixSection[] = [];
    
    // Enhanced interface for file sections
    interface FileSection {
      fileName: string;
      fields: string[];
      isMissing: boolean; // Flag to indicate if document is completely missing
    }
    
    let inHowToFixSection = false;
    let fileSections: FileSection[] = [];
    let currentFileSection: FileSection | null = null;

    // Look for specific section headers
    const howToFixHeaders = [
      'HOW TO FIX', 
      'GUIDANCE', 
      'RECOMMENDATIONS', 
      'NEXT STEPS',
      'REQUIRED ACTIONS',
      'ACTION REQUIRED',
      'FIX REQUIRED'
    ];
    
    // Helper function to clean up markdown and formatting
    const cleanMarkdown = (text: string): string => {
      return text
        .replace(/\*\*/g, '') // Remove bold markdown **text**
        .replace(/\*/g, '')    // Remove italic markdown *text*
        .replace(/`/g, '')     // Remove code markdown `text`
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace [text](url) with just text
        .replace(/^[-•*]\s*/, '') // Remove bullet points at the start
        .replace(/^>\s*/, '')  // Remove blockquote formatting
        .replace(/#/g, '')     // Remove all # characters
        .replace(/\\_/g, '_')  // Fix escaped underscores
        .replace(/\\`/g, '`')  // Fix escaped backticks
        .trim();
    };

    // Parse missing fields to identify documents with issues
    const missingFields = parseMissingFields(agentOutput);
    const missingDocuments = new Set(missingFields.map(field => field.filename.toLowerCase()));
    
    // First identify the "How to Fix" section
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();
      
      // Check if we're entering a "How to Fix" or guidance section
      const isHeader = howToFixHeaders.some(header => 
        trimmedLine.toUpperCase().includes(header)
      );
      
      if (isHeader) {
        inHowToFixSection = true;
        continue;
      }

      if (!inHowToFixSection) continue;

      // Stop parsing if we hit another major section
      if (inHowToFixSection && (
        trimmedLine.includes('MISSING FIELDS') ||
        trimmedLine.includes('DOCUMENT TEMPLATES') ||
        (trimmedLine.match(/^[A-Z\s]+$/) && trimmedLine.length > 15)
      )) {
        break;
      }
      
      // Skip empty lines and separator lines
      if (trimmedLine === '' || /^[-=*#]+$/.test(trimmedLine)) {
        continue;
      }
      
      // Check if this line is a .txt file reference
      const fileMatch = trimmedLine.match(/(.+\.txt)/i);
      // Also check for file names that might be wrapped in code or bold markdown
      const markdownFileMatch = trimmedLine.match(/[`*](.+\.txt)[`*]/i);
      const hasTxt = fileMatch || markdownFileMatch || 
                      trimmedLine.toLowerCase().includes('.txt') ||
                      (i+1 < lines.length && lines[i+1].toLowerCase().includes('missing fields'));
      
      if (hasTxt) {
        // Extract file name - prefer the markdown match if it exists
        let fileName = '';
        if (markdownFileMatch) {
          fileName = markdownFileMatch[1];
        } else if (fileMatch) {
          fileName = fileMatch[1];
        } else {
          // Extract the file name using heuristics
          const potentialFileName = trimmedLine.replace(/[\*`]/g, '').trim();
          if (potentialFileName.toLowerCase().includes('.txt')) {
            fileName = potentialFileName;
          } else {
            fileName = "Document " + (fileSections.length + 1);
          }
        }
        
        // Clean the filename
        const cleanedFileName = cleanMarkdown(fileName);
        
        // Check if this file is in the missing documents list
        const isMissing = missingDocuments.has(cleanedFileName.toLowerCase()) || 
                          trimmedLine.toLowerCase().includes('missing') ||
                          (i-1 >= 0 && lines[i-1].toLowerCase().includes('missing'));
        
        // Only proceed if the document is missing or has issues
        if (isMissing) {
          // Complete the current file section if exists
          if (currentFileSection && currentFileSection.fields.length > 0) {
            fileSections.push(currentFileSection);
          }
          
          // Start a new file section
          currentFileSection = {
            fileName: cleanedFileName,
            fields: [],
            isMissing: isMissing
          };
        } else {
          // Skip this file section as it's not missing or doesn't have issues
          currentFileSection = null;
        }
        continue;
      }
      
      // If we're in a file section for a missing document, add this as a field
      if (currentFileSection) {
        // Check if it's a bullet point or numbered item
        if (/^[-•*]\s/.test(trimmedLine) || /^\d+\.\s/.test(trimmedLine) || 
            /^[A-Za-z0-9][\w\s]+:/.test(trimmedLine)) {
          
          currentFileSection.fields.push(cleanMarkdown(trimmedLine));
        } else if (currentFileSection.fields.length > 0) {
          // Append to the last field if it's a continuation
          const lastIndex = currentFileSection.fields.length - 1;
          currentFileSection.fields[lastIndex] += ' ' + cleanMarkdown(trimmedLine);
        } else {
          // Add as a new field if we don't have any yet
          currentFileSection.fields.push(cleanMarkdown(trimmedLine));
        }
      }
    }
    
    // Add the last file section if it exists and has fields
    if (currentFileSection && currentFileSection.fields.length > 0) {
      fileSections.push(currentFileSection);
    }
    
    // Convert file sections to fix sections, only including those with missing fields
    if (fileSections.length > 0) {
      fileSections.forEach(fileSection => {
        if (fileSection.fields.length > 0) {
          fixSections.push({
            title: fileSection.fileName,
            items: fileSection.fields
          });
        }
      });
    }
    
    // If no structured sections found, try to parse as general text
    if (fixSections.length === 0) {
      // Try to extract any field names from the text
      const fieldRegex = /\*\*([^:]+):\*\*\s*([^*]+)/g;
      let matches = [...agentOutput.matchAll(fieldRegex)];
      
      if (matches.length > 0) {
        const items = matches.map(m => `${cleanMarkdown(m[1])}: ${cleanMarkdown(m[2])}`);
        fixSections.push({
          title: 'Required Information',
          items: items
        });
      } else {
        // Fallback to general guidance
        const allText = agentOutput.replace(/\n+/g, ' ').trim();
        if (allText) {
          // Split into sentences and group them
          const sentences = allText.split(/[.!?]+/).filter(s => s.trim().length > 10);
          if (sentences.length > 0) {
            fixSections.push({
              title: 'Application Guidance',
              items: sentences.map(s => cleanMarkdown(s.trim())).filter(s => s.length > 0)
            });
          }
        }
      }
    }

    return fixSections;
  };

  // Parse missing fields from agent output - only the MISSING FIELDS section
  const parseMissingFields = (agentOutput: string) => {
    const lines = agentOutput.split('\n');
    const missingFields: Array<{filename: string, issues: string[]}> = [];
    
    let currentFile = '';
    let currentIssues: string[] = [];
    let inMissingFieldsSection = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Check if we're entering the MISSING FIELDS section
      if (trimmedLine === 'MISSING FIELDS' || trimmedLine.startsWith('MISSING FIELDS')) {
        inMissingFieldsSection = true;
        continue;
      }
      
      // Stop parsing if we hit another section or end of missing fields
      if (inMissingFieldsSection && (
        trimmedLine.startsWith('--') && line.indexOf('--') > 10 || // End of section dashes
        (trimmedLine.match(/^[A-Z\s]+$/) && trimmedLine.length > 10 && !trimmedLine.includes('MISSING FIELDS')) ||
        trimmedLine === '' && lines.indexOf(line) > lines.findIndex(l => l.includes('MISSING FIELDS')) + 10
      )) {
        break;
      }
      
      if (!inMissingFieldsSection) continue;
      
      // Skip separator lines at start
      if (trimmedLine.startsWith('--') || trimmedLine === '') continue;
      
      // Check for numbered items (filenames)
      const numberedMatch = trimmedLine.match(/^\d+\.\s*(.+\.txt)\s*$/);
      if (numberedMatch) {
        // Save previous file if it exists
        if (currentFile && currentIssues.length > 0) {
          missingFields.push({
            filename: currentFile,
            issues: [...currentIssues]
          });
        }
        
        currentFile = numberedMatch[1];
        currentIssues = [];
      }
      // Check for bullet points (issues)
      else if (trimmedLine.startsWith('- ') && currentFile) {
        currentIssues.push(trimmedLine.substring(2));
      }
    }
    
    // Add the last file if it exists
    if (currentFile && currentIssues.length > 0) {
      missingFields.push({
        filename: currentFile,
        issues: [...currentIssues]
      });
    }
    
    return missingFields;
  };

  // Parse the document templates section from agent output
  const parseDocumentTemplates = (agentOutput: string): Array<{name: string; filename: string}> => {
    const lines = agentOutput.split('\n');
    const templates: Array<{name: string; filename: string}> = [];
    
    let inTemplatesSection = false;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if we're entering the DOCUMENT TEMPLATES section
      if (line.match(/^##?\s*DOCUMENT TEMPLATES/i) || line === 'DOCUMENT TEMPLATES' || line.startsWith('DOCUMENT TEMPLATES')) {
        inTemplatesSection = true;
        continue;
      }
      
      // Exit if we hit another section
      if (inTemplatesSection && 
          ((line.match(/^##?\s*[A-Z\s]+$/) && line.length > 10) || 
           (line.match(/^[A-Z\s]+$/) && line.length > 10) ||
           line.startsWith('--') && line.length > 10)) {
        break;
      }
      
      if (!inTemplatesSection) continue;
      
      // Skip empty lines
      if (line === '') continue;
      
      // Look for numbered list items with .txt files (new format: "1. Design_and_Access_Statement.txt")
      const templateMatch = line.match(/^\d+\.\s*([A-Za-z0-9_]+\.txt)$/i);
      if (templateMatch) {
        const filename = templateMatch[1];
        // Convert filename to a more readable name
        const name = filename
          .replace(/\.txt$/i, '')
          .replace(/_/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        templates.push({
          name,
          filename
        });
      } else {
        // Look for numbered list items with "SAMPLE DOCUMENT:" format (legacy support)
        const sampleDocMatch = line.match(/^\d+\.\s*SAMPLE DOCUMENT:\s*(.+)$/i);
        if (sampleDocMatch) {
          let name = sampleDocMatch[1].trim();
          // Remove any remaining "SAMPLE DOCUMENT" text if it somehow appears
          name = name.replace(/SAMPLE DOCUMENT:?\s*/gi, '').trim();
          // Create filename by converting name to lowercase, replacing spaces with underscores, and adding .txt
          const filename = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '.txt';
          
          templates.push({
            name,
            filename
          });
        }
      }
    }
    
    return templates;
  };
  
  // Get document description from the How to Fix section
  const getDocumentDescription = (documentName: string, agentOutput: string): string => {
    const lines = agentOutput.split('\n');
    let description = '';
    let foundDocument = false;
    
    // First try to find exact document name
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.includes(documentName) && 
          (line.includes('.txt') || line.match(/^\d+\./))) {
        foundDocument = true;
        
        // Look at the next few lines for a description
        for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
          const descLine = lines[j].trim();
          
          // Stop if we hit another document or section
          if (descLine.match(/^\d+\./) || 
              descLine === '' || 
              descLine.match(/^[A-Z\s]+$/) ||
              descLine.includes('.txt')) {
            break;
          }
          
          description += ' ' + descLine;
        }
        
        if (description) break;
      }
    }
    
    // If no description found, try to find by document type
    if (!description) {
      const documentType = documentName.toLowerCase().replace(/\s+/g, ' ');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase().trim();
        
        if (line.includes(documentType)) {
          // Grab this line and the next as a potential description
          description = lines[i].trim();
          if (i + 1 < lines.length && !lines[i + 1].match(/^\d+\./)) {
            description += ' ' + lines[i + 1].trim();
          }
          break;
        }
      }
    }
    
    return description.trim() || `Template for ${documentName}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete': return '#4CAF50';
      case 'partial': return '#FF9800';
      case 'missing': return '#F44336';
      default: return '#9E9E9E';
    }
  };
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle sx={{ color: '#4CAF50' }} />;
      case 'partial': return <Warning sx={{ color: '#FF9800' }} />;
      case 'missing': return <ErrorIcon sx={{ color: '#F44336' }} />;
      default: return <Info sx={{ color: '#9E9E9E' }} />;
    }
  };

  const checkApplication = async () => {
    setLoading(true);
    setError(null);
    setResponse([]);
    setHasStarted(true);
    setProgressMessage('Initializing connection to planning system...');

    try {
      const prompt = `check planning application ${applicationRef}`;
      setAgentPrompt(prompt); // Store the prompt in state
      console.log('Modal: Starting DirectLine request with popup auth, prompt:', prompt);

      setProgressMessage('Connecting to planning assistant...');

      // Use Bot Framework compatible authentication method
      console.log('Modal: Using Bot Framework authentication method...');
      setProgressMessage('Authenticating with planning system...');

      setProgressMessage('Sending application check request...');
      const botResponse = await DirectLineService.sendMessageDetailed(prompt);

      setProgressMessage('Processing response from planning system...');
      console.log('Modal: Received bot response:', botResponse);
      console.log('MODAL: RAW BOT RESPONSE FROM AGENT:', JSON.stringify(botResponse, null, 2));

      if (botResponse.messages.length > 0) {
        console.log('MODAL: Processing bot messages:', botResponse.messages);
        setProgressMessage('Analyzing application status...');
        setResponse(botResponse.messages);
        setHasPermissionRequest(botResponse.hasPermissionRequest);
        setSuggestedActions(botResponse.suggestedActions);

        // If we got a message but it's about permissions, show it as a warning rather than success
        if (botResponse.hasPermissionRequest) {
          setError(botResponse.messages.join('\n'));
        }

        setProgressMessage('Application status check completed successfully.');
      } else {
        console.log('Modal: No text responses found, bot may have responded with rich content');
        setError('The planning assistant responded, but the response format is not supported in this view. Please try using the full chat interface below.');
      }
    } catch (err) {
      console.error('Modal: Error checking application:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      if (errorMessage.toLowerCase().includes('login') || errorMessage.toLowerCase().includes('auth')) {
        setError(`Authentication required: ${errorMessage}. Please try the login button below or contact support.`);
      } else {
        setError(`Failed to check application status: ${errorMessage}. Please try again later.`);
      }
    } finally {
      setLoading(false);
      setProgressMessage('');
    }
  };

  const handleManualLogin = async () => {
    try {
      const authService = AuthService.getInstance();
      await authService.loginWithPopup();
      // After successful login, retry the application check
      await checkApplication();
    } catch (error) {
      console.error('Manual login failed:', error);
      setError('Login failed. Please try again or contact support.');
    }
  };

  // Function to copy raw output to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(response.join('\n\n'))
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000); // Reset after 3 seconds
      })
      .catch(() => {
        // Handle error
        console.error('Failed to copy text');
      });
  };

  // Start the check when modal opens
  React.useEffect(() => {
    if (open && !hasStarted) {
      checkApplication();
    }
  }, [open]); // Reset state when modal closes
  React.useEffect(() => {
    if (!open) {
      setLoading(false);
      setResponse([]);
      setError(null);
      setHasStarted(false);
      setHasPermissionRequest(false);
      setSuggestedActions([]);
      setTabValue(0);
    }
  }, [open]);

  const handleConnect = async () => {
    // Open the specific Copilot Studio connections page
    const connectionsUrl = 'https://copilotstudio.microsoft.com/c2/tenants/de6b5354-c00a-4c06-888c-81936c42d6f2/environments/Default-de6b5354-c00a-4c06-888c-81936c42d6f2/bots/cr41e_planCheckr/channels/pva-studio/conversations/a81799fb-94f2-4aad-aba6-55fd903fecb8/user-connections';
    window.open(connectionsUrl, '_blank');

    // Show helpful guidance
    setError('Opening Copilot Studio connections page...\n\nIf connections are already set up, please click "Retry" below to test the bot again.\n\nIf you see connection issues, review and reconnect any expired or failed connections, then return here and click "Retry".');
  };
  // Template URL mapping for missing documents
  const getDocumentTemplate = (documentName: string) => {
    const templates: Record<string, { url: string; description: string }> = {
      'Design and Access Statement': {
        url: '/templates/design-access-statement-template.pdf',
        description: 'Template for Design and Access Statement including sections for design rationale, materials, and accessibility',
      },
      'Planning Statement': {
        url: '/templates/planning-statement-template.pdf',
        description: 'Template for Planning Statement covering proposed works and policy compliance',
      },
      'Flood Risk Assessment': {
        url: '/templates/flood-risk-assessment-template.pdf',
        description: 'Template for Flood Risk Assessment including flood zone identification and mitigation measures',
      },
      'Heritage Statement': {
        url: '/templates/heritage-statement-template.pdf',
        description: 'Template for Heritage Statement including asset description, impact assessment, and justification',
      },
      'Tree Survey or Arboricultural Report': {
        url: '/templates/tree-survey-template.pdf',
        description: 'Template for Tree Survey including locations, species, and protection measures',
      },
      'Biodiversity or Ecology Report': {
        url: '/templates/biodiversity-ecology-template.pdf',
        description: 'Template for Biodiversity/Ecology Report including habitat assessment and species protection',
      },
    };
    return templates[documentName];
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}      PaperProps={{
        sx: {
          width: '90vw',
          height: '85vh',
          maxWidth: '1400px',
          minHeight: '600px',
          borderRadius: '12px',
          overflow: 'hidden',
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: '#4CAF50',
          color: 'white',
          py: 2,
          px: 3,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box>
          <Typography variant="h6" component="div" sx={{ color: 'white', fontSize: '1.2em' }}>
            Application Status Check
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5, color: 'white', fontSize: '1.2em' }}>
            Reference: {applicationRef}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          sx={{
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          p: 3,
          gap: 2
        }}>
          {loading && (
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 3,
              backgroundColor: '#f5f5f5',
              borderRadius: '8px'            }}>
              <CircularProgress size={24} sx={{ color: '#4CAF50' }} />
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  Checking your application status...
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {progressMessage || 'Preparing to check application status...'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
                  Application {applicationRef} - This may take a few moments, please wait...
                </Typography>
              </Box>
            </Box>
          )}          {error && (
            <Alert
              severity={hasPermissionRequest ? "warning" : "error"}
              sx={{
                borderRadius: '8px',
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
              action={
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>                  {hasPermissionRequest && (
                    <Button
                      color="inherit"
                      size="small"
                      onClick={handleConnect}
                      disabled={loading}
                      sx={{
                        backgroundColor: '#1976d2',
                        color: 'white',
                        fontWeight: 600,
                        '&:hover': {
                          backgroundColor: '#1565c0'
                        },
                        '&:disabled': {
                          backgroundColor: 'rgba(25, 118, 210, 0.3)',
                          color: 'rgba(255, 255, 255, 0.5)'
                        }
                      }}
                    >
                      🔗 Connect to Planning System
                    </Button>
                  )}
                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<AccountCircle />}
                    onClick={handleManualLogin}
                    disabled={loading}
                  >
                    Login
                  </Button>                  <Button
                    color="inherit"
                    size="small"
                    startIcon={<Refresh />}
                    onClick={checkApplication}
                    disabled={loading}
                  >
                    Retry
                  </Button>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={() => {
                      console.log('Testing agent output...');
                      // Add your logic for testing agent output here
                    }}
                    disabled={loading}
                    sx={{
                      backgroundColor: '#2196f3',
                      color: 'white',
                      fontWeight: 600,
                      '&:hover': {
                        backgroundColor: '#1976d2'
                      }
                    }}
                  >
                    🧪 Test Agent Output
                  </Button>
                </Box>
              }
            >              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {hasPermissionRequest ? '🔗 Planning System Connection Required' : 'Unable to retrieve application status'}
              </Typography>              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {hasPermissionRequest ?
                  'The planning assistant is working but cannot access the planning system data. This usually means connections need to be refreshed or re-authenticated.' :
                  error
                }
              </Typography>{hasPermissionRequest && (
                <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                    📋 Setup Instructions:
                  </Typography>
                  <Typography variant="body2" component="div" sx={{ fontSize: '0.875rem' }}>
                    1. Click <strong>"🔗 Connect to Planning System"</strong> below<br />
                    2. Check that <strong>GetRequirementsDocument</strong> and <strong>GetApplicationDetails</strong> show as "Connected"<br />
                    3. If any connections show "Expired" or "Not Connected", click <strong>"Manage"</strong> to reconnect<br />
                    4. Return here and click <strong>"Retry"</strong> to test the connection
                  </Typography>
                </Box>
              )}
            </Alert>
          )}          {response.length > 0 && (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h6" sx={{
                color: '#2E7D32',
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                📋 Application {applicationRef} - Detailed Status
              </Typography>
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs
                  value={tabValue}
                  onChange={(_, newValue) => setTabValue(newValue)}
                  sx={{
                    '& .MuiTabs-root': {
                      minHeight: 56,
                    },
                    '& .MuiTab-root': {
                      fontSize: '1rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      minHeight: 48,
                      px: 3,
                      py: 1,
                      color: 'text.primary',
                      backgroundColor: '#f5f5f5',
                      border: '1px solid #e0e0e0',
                      borderRadius: 0,
                      marginRight: '-1px',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                        color: 'primary.main',
                      },
                      '&.Mui-selected': {
                        backgroundColor: '#e3f2fd',
                        color: '#1565c0',
                        fontWeight: 600,
                        border: '1px solid',
                        borderColor: '#bbdefb',
                        '&:hover': {
                          backgroundColor: '#d1eaff',
                        }
                      }
                    },
                    '& .MuiTabs-indicator': {
                      display: 'none', // Hide the default indicator since we're using background colors
                    },
                    '& .MuiTabs-flexContainer': {
                      gap: 0,
                      px: 0,
                      pt: 2,
                      justifyContent: 'flex-start'
                    }
                  }}
                >                  <Tab label="Overview" />
                  <Tab label="How to Fix" />
                  <Tab label="Template Library" />
                  <Tab label="Raw Output" />
                </Tabs>
              </Box>

              {/* Overview Tab */}
              {tabValue === 0 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  <Grid container spacing={3}>
                    {/* Application Summary */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Home color="primary" />
                            Application Summary
                          </Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Reference:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{applicationRef}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Applicant:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>John Smith</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Site:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>12 Garden Lane</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>Type:</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>Single-storey extension</Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Progress */}
                    <Grid item xs={12} md={6}>
                      <Card sx={{ height: '100%', border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Assignment color="primary" />
                            Progress
                          </Typography>
                          {(() => {
                            const docs = parseApplicationData(response.join(' '));
                            const missing = docs.filter(d => d.status === 'missing').length;
                            const total = docs.length;

                            return (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>Missing:</Typography>
                                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{missing} / {total}</Typography>
                                </Box>
                                <Box sx={{ position: 'relative', height: 24, borderRadius: 12, bgcolor: '#f5f5f5', overflow: 'hidden' }}>
                                  <Box sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    height: '100%',
                                    width: `${Math.round((missing / total) * 100)}%`,
                                    bgcolor: '#f44336',
                                    transition: 'width 0.3s ease-in-out',
                                  }} />
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      position: 'absolute',
                                      top: 0,
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      color: '#fff',
                                      fontWeight: 600,
                                    }}
                                  >
                                    {Math.round((missing / total) * 100)}%
                                  </Typography>
                                </Box>
                              </Box>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Required Documents */}
                    <Grid item xs={12}>
                      <Card sx={{ border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>Required Documents</Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {parseApplicationData(response.join(' ')).map((doc, index) => (
                              <Chip
                                key={index}
                                icon={getStatusIcon(doc.status)}
                                label={doc.name}
                                sx={{
                                  bgcolor: doc.status === 'missing' ? '#e8f5e8' : '#ffebee',
                                  color: getStatusColor(doc.status),
                                  fontWeight: 500,
                                  '& .MuiChip-label': {
                                    color: '#2E7D32', // Dark green text for document names
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>                    {/* Missing Fields */}
                    <Grid item xs={12}>
                      <Card sx={{ border: '1px solid #e0e0e0' }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ mb: 2 }}>Missing Fields</Typography>
                          {(() => {
                            const rawOutput = response.join('\n');
                            const missingFields = parseMissingFields(rawOutput);
                            
                            return missingFields.length > 0 ? (
                              <List>
                                {missingFields.map((field, index) => (
                                  <ListItem key={index} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <ListItemText
                                      primary={
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#d32f2f' }}>
                                          {field.filename}
                                        </Typography>
                                      }
                                      secondary={
                                        <List dense sx={{ mt: 1 }}>
                                          {field.issues.map((issue, issueIndex) => (
                                            <ListItem key={issueIndex} sx={{ py: 0, px: 0 }}>
                                              <ListItemText
                                                primary={
                                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                    • {issue}
                                                  </Typography>
                                                }
                                              />
                                            </ListItem>
                                          ))}
                                        </List>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            ) : (
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                No missing fields
                              </Typography>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}

              {/* Raw Output Tab */}
              {tabValue === 3 && (
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {/* Prompt Section */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                        Agent Prompt
                      </Typography>
                    </Box>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        bgcolor: '#f9f9f9',
                        fontFamily: 'monospace',
                        fontSize: '0.875rem',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                        mb: 3,
                      }}
                    >
                      {agentPrompt || `check planning application ${applicationRef}`}
                    </Paper>
                  </Box>

                  {/* Response Section */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      CPS Agent Raw Response
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<ContentCopy />}
                      onClick={copyToClipboard}
                      color="primary"
                    >
                      {copySuccess ? 'Copied!' : 'Copy to clipboard'}
                    </Button>
                  </Box>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      bgcolor: '#f5f5f5',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'break-word',
                      maxHeight: '60vh',
                      overflow: 'auto',
                    }}
                  >
                    {response.join('\n\n')}
                  </Paper>
                </Box>              )}              
              {/* How to Fix Tab */}
              {tabValue === 1 && (
                <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                  {/* Main Title with Icon */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 4,
                      p: 2,
                      background: 'linear-gradient(145deg, #2196f3 0%, #1976d2 100%)',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(33, 150, 243, 0.25)'
                    }}
                  >
                    <Info sx={{ mr: 2, color: 'white', fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                      How to Fix
                    </Typography>
                  </Box>
                  
                  {/* Simple text content */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 3,
                      border: '1px solid #e0e0e0',
                      borderRadius: 2,
                      bgcolor: '#fafafa',
                    }}
                  >
                    {(() => {
                      const rawOutput = response.join('\n');
                      
                      // Extract the "How to Fix" section content
                      const lines = rawOutput.split('\n');
                      let howToFixContent = '';
                      let inHowToFixSection = false;
                      
                      for (let i = 0; i < lines.length; i++) {
                        const line = lines[i].trim();
                        
                        // Check if we're entering the "How to Fix" section
                        if (line.match(/^##?\s*HOW TO FIX/i) || line.match(/^How to Fix/i)) {
                          inHowToFixSection = true;
                          continue; // Skip the header line
                        }
                        
                        // Exit if we hit the DOCUMENT TEMPLATES section
                        if (inHowToFixSection && line.match(/^##?\s*DOCUMENT TEMPLATES/i)) {
                          break;
                        }
                        
                        // Add all content while in the section
                        if (inHowToFixSection) {
                          howToFixContent += lines[i] + '\n'; // Keep original line with formatting
                        }
                      }
                      
                      // Convert markdown to HTML
                      const convertMarkdownToHtml = (text: string): string => {
                        return text
                          // Bold text **text** or __text__
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/__(.*?)__/g, '<strong>$1</strong>')
                          // Italic text *text* or _text_
                          .replace(/\*(.*?)\*/g, '<em>$1</em>')
                          .replace(/_(.*?)_/g, '<em>$1</em>')
                          // Code `code`
                          .replace(/`(.*?)`/g, '<code>$1</code>')
                          // Links [text](url)
                          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
                          // Headers ### text
                          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
                          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
                          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
                          // Bullet points - item or * item
                          .replace(/^[\s]*[-*]\s+(.*)$/gm, '<li>$1</li>')
                          // Numbered lists 1. item
                          .replace(/^[\s]*\d+\.\s+(.*)$/gm, '<li>$1</li>');
                      };
                      
                      // Split content into sections and process
                      const sections = howToFixContent.split('\n\n').filter(section => section.trim());
                      
                      return sections.length > 0 ? (
                        <Box>
                          {sections.map((section, index) => {
                            const htmlContent = convertMarkdownToHtml(section.trim());
                            
                            // Check if this section contains list items
                            if (htmlContent.includes('<li>')) {
                              // Wrap list items in ul tags
                              const wrappedContent = htmlContent.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
                              return (
                                <Box 
                                  key={index}
                                  sx={{ mb: 2 }}
                                  dangerouslySetInnerHTML={{ __html: wrappedContent }}
                                />
                              );
                            } else {
                              // Regular paragraph content
                              return (
                                <Typography 
                                  key={index}
                                  variant="body1" 
                                  sx={{ 
                                    mb: 2,
                                    lineHeight: 1.6,
                                    color: 'text.primary',
                                    '& strong': { fontWeight: 'bold' },
                                    '& em': { fontStyle: 'italic' },
                                    '& code': { 
                                      bgcolor: '#f5f5f5', 
                                      padding: '2px 4px', 
                                      borderRadius: '3px',
                                      fontFamily: 'monospace'
                                    },
                                    '& a': { 
                                      color: '#1976d2', 
                                      textDecoration: 'none',
                                      '&:hover': { textDecoration: 'underline' }
                                    },
                                    '& h1, & h2, & h3': { 
                                      fontWeight: 'bold',
                                      margin: '16px 0 8px 0'
                                    }
                                  }}
                                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                                />
                              );
                            }
                          })}
                        </Box>
                      ) : (
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            color: 'text.secondary',
                            fontStyle: 'italic',
                            textAlign: 'center'
                          }}
                        >
                          No guidance available at this time.
                        </Typography>
                      );
                    })()}
                  </Paper>
                </Box>
              )}              {/* Document Templates Tab */}
              {tabValue === 2 && (
                <Box sx={{ flex: 1, overflow: 'auto', p: 3 }}>
                  {/* Title section with icon */}
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 4,
                      p: 2,
                      background: 'linear-gradient(145deg, #4caf50 0%, #388e3c 100%)',
                      borderRadius: 2,
                      boxShadow: '0 4px 20px rgba(76, 175, 80, 0.25)'
                    }}
                  >
                    <Description sx={{ mr: 2, color: 'white', fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white' }}>
                      Document Templates
                    </Typography>
                  </Box>
                  
                  <Typography variant="subtitle1" sx={{ mb: 3, textAlign: 'center', color: 'text.secondary' }}>
                    Download templates for the documents required for your planning application
                  </Typography>
                  
                  <Grid container spacing={3}>
                    {(() => {
                      const rawOutput = response.join('\n');
                      const templates = parseDocumentTemplates(rawOutput);
                      
                      return templates.map((template, index) => {
                        const documentDescription = getDocumentDescription(template.name, rawOutput);
                        const sharePointBaseUrl = 'https://mngenvmcap971093.sharepoint.com/sites/PPApplications/Planning%20Document%20Templates/';
                        
                        return (
                          <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card 
                              sx={{ 
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: 2,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-8px)',
                                  boxShadow: '0 12px 20px rgba(0,0,0,0.15)'
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  bgcolor: '#f5f5f5',
                                  p: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  borderBottom: '1px solid #e0e0e0'
                                }}
                              >
                                <Box
                                  sx={{
                                    bgcolor: '#4caf50',
                                    color: 'white',
                                    width: 40,
                                    height: 40,
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2
                                  }}
                                >
                                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>{index + 1}</Typography>
                                </Box>
                                <Box>
                                  <Typography 
                                    variant="subtitle1" 
                                    sx={{ 
                                      fontWeight: 'bold',
                                      color: '#333'
                                    }}
                                  >
                                    {template.name}
                                  </Typography>
                                  <Typography variant="caption" color="text.secondary">
                                    {template.filename}
                                  </Typography>
                                </Box>
                              </Box>
                              
                              <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  {documentDescription}
                                </Typography>
                              </CardContent>
                              
                              <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'flex-end' }}>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  href={`${sharePointBaseUrl}${template.filename}`}
                                  target="_blank"
                                  startIcon={<Description />}
                                  sx={{
                                    bgcolor: '#4caf50',
                                    '&:hover': {
                                      bgcolor: '#388e3c'
                                    }
                                  }}
                                >
                                  Download
                                </Button>
                              </Box>
                            </Card>
                          </Grid>
                        );
                      });
                    })()}
                  </Grid>
                  
                  <Box sx={{ textAlign: 'center', mt: 4, p: 2, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      All templates are available in the <a href="https://mngenvmcap971093.sharepoint.com/sites/PPApplications/Planning%20Document%20Templates/" target="_blank" rel="noopener noreferrer" style={{ color: '#4caf50', fontWeight: 'bold' }}>SharePoint Document Library</a>
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Show suggested actions if available */}
              {suggestedActions.length > 0 && (
                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Suggested actions:
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {suggestedActions.map((action, index) => (
                      <Button
                        key={index}
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          console.log('Suggested action clicked:', action);
                          // Handle suggested action - could trigger another bot message
                        }}
                      >
                        {action.title || action.value || `Action ${index + 1}`}
                      </Button>
                    ))}
                  </Box>
                </Box>
              )}
            </Box>
          )}{!loading && !error && response.length === 0 && hasStarted && (
            <Box sx={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: 2,
              color: 'text.secondary'
            }}>
              <Typography variant="body1">
                🤔 No text response received
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
                The planning assistant may have responded with rich content (cards, buttons, etc.) that requires the full chat interface.
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', fontWeight: 500 }}>
                💡 Try using the chat interface below for full functionality
              </Typography>
            </Box>          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationStatusModal;