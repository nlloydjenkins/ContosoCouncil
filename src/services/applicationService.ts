export interface Application {
  id: string
  referenceNumber: string
  title: string
  description: string
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'More Information Required'
  submissionDate: string
  address: string
  applicationType: string
  documents: Document[]
  timeline: TimelineEvent[]
}

export interface Document {
  id: string
  name: string
  type: string
  size: number
  uploadDate: string
  url: string
}

export interface TimelineEvent {
  id: string
  title: string
  description: string
  date: string
  status: 'completed' | 'current' | 'pending'
}

// Mock data
const mockApplications: Application[] = [
  {
    id: '1',
    referenceNumber: 'PP-2025-010001',
    title: 'Two Storey Side Extension with Solar Panels',
    description: 'Proposed two storey side extension to existing dwelling with eco-friendly solar panel installation and rainwater harvesting system.',
    status: 'Under Review',
    submissionDate: '2025-05-01',
    address: '42 Greenfield Lane, Eco Valley, EV4 2GH',
    applicationType: 'Householder Application',
    documents: [
      {
        id: '1',
        name: 'Site Plan.pdf',
        type: 'application/pdf',
        size: 2048576,
        uploadDate: '2025-05-01',
        url: '/documents/site-plan.pdf'
      },
      {
        id: '2',
        name: 'Elevation Drawings.pdf',
        type: 'application/pdf',
        size: 3145728,
        uploadDate: '2025-05-01',
        url: '/documents/elevation-drawings.pdf'
      },
      {
        id: '3',
        name: 'Environmental Impact Assessment.pdf',
        type: 'application/pdf',
        size: 4194304,
        uploadDate: '2025-05-05',
        url: '/documents/environmental-impact.pdf'
      },
      {
        id: '4',
        name: 'Solar Panel Specifications.pdf',
        type: 'application/pdf',
        size: 1572864,
        uploadDate: '2025-05-10',
        url: '/documents/solar-specs.pdf'
      },
      {
        id: '5',
        name: 'Structural Engineer Report.pdf',
        type: 'application/pdf',
        size: 2621440,
        uploadDate: '2025-05-15',
        url: '/documents/structural-report.pdf'
      }
    ],
    timeline: [
      {
        id: '1',        title: 'Application Submitted',
        description: 'Your eco-friendly extension application has been received and assigned reference number PP-2025-010001',
        date: '2025-05-01',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Initial Review',
        description: 'Application reviewed for completeness and environmental compliance',
        date: '2025-05-03',
        status: 'completed'
      },
      {
        id: '3',
        title: 'Additional Documents Requested',
        description: 'Environmental Impact Assessment and Solar Panel specifications requested',
        date: '2025-05-05',
        status: 'completed'
      },
      {
        id: '4',
        title: 'Documents Submitted',
        description: 'All requested documents have been uploaded successfully',
        date: '2025-05-15',
        status: 'completed'
      },
      {
        id: '5',
        title: 'Technical Assessment',
        description: 'Detailed technical review by planning officers and environmental specialists',
        date: '2025-05-20',
        status: 'current'
      },
      {
        id: '6',
        title: 'Public Consultation',
        description: 'Neighbour consultation period',
        date: '2025-06-05',
        status: 'pending'
      },
      {
        id: '7',
        title: 'Decision Notice',
        description: 'Final decision will be issued',
        date: '2025-06-20',
        status: 'pending'
      }
    ]
  },
  {
    id: '2',
    referenceNumber: 'PP-2025-010002',
    title: 'Single Storey Rear Extension',
    description: 'Proposed single storey rear extension to existing dwelling, extending 6m from the rear wall.',
    status: 'Under Review',
    submissionDate: '2025-05-15',
    address: '123 Oak Street, Contoso, CT1 2AB',
    applicationType: 'Householder Application',
    documents: [
      {
        id: '1',
        name: 'Site Plan.pdf',
        type: 'application/pdf',
        size: 2048576,
        uploadDate: '2025-05-15',
        url: '/documents/site-plan.pdf'
      },
      {
        id: '2',
        name: 'Elevation Drawings.pdf',
        type: 'application/pdf',
        size: 3145728,
        uploadDate: '2025-05-15',
        url: '/documents/elevation-drawings.pdf'
      }
    ],
    timeline: [
      {
        id: '1',        title: 'Application Submitted',
        description: 'Your application has been received and assigned reference number PP-2025-010002',
        date: '2025-05-15',
        status: 'completed'
      },
      {
        id: '2',
        title: 'Initial Review',
        description: 'Application is being reviewed for completeness and compliance',
        date: '2025-05-18',
        status: 'completed'
      },
      {
        id: '3',
        title: 'Technical Assessment',
        description: 'Detailed technical review by planning officers',
        date: '2025-05-25',
        status: 'current'
      },
      {
        id: '4',
        title: 'Decision Notice',
        description: 'Final decision will be issued',
        date: '2025-06-15',
        status: 'pending'
      }
    ]
  },  {
    id: '3',
    referenceNumber: 'PP-2025-010003',
    title: 'Loft Conversion',
    description: 'Conversion of existing loft space to habitable room with dormer window.',
    status: 'Approved',
    submissionDate: '2025-04-01',
    address: '456 Maple Avenue, Contoso, CT2 3CD',
    applicationType: 'Householder Application',
    documents: [
      {
        id: '3',
        name: 'Floor Plans.pdf',
        type: 'application/pdf',
        size: 1572864,
        uploadDate: '2025-04-01',
        url: '/documents/floor-plans.pdf'
      }
    ],
    timeline: [
      {
        id: '5',        title: 'Application Submitted',
        description: 'Your application has been received and assigned reference number PP-2025-010003',
        date: '2025-04-01',
        status: 'completed'
      },
      {
        id: '6',
        title: 'Initial Review',
        description: 'Application reviewed for completeness',
        date: '2025-04-03',
        status: 'completed'
      },
      {
        id: '7',
        title: 'Technical Assessment',
        description: 'Technical review completed',
        date: '2025-04-15',
        status: 'completed'
      },
      {
        id: '8',
        title: 'Decision Notice',
        description: 'Planning permission granted',
        date: '2025-04-28',
        status: 'completed'
      }
    ]
  },  {
    id: '4',
    referenceNumber: 'PP-2025-010004',
    title: 'Garden Shed',
    description: 'Construction of detached garden shed for storage purposes.',
    status: 'Pending',
    submissionDate: '2025-05-28',
    address: '789 Pine Road, Contoso, CT3 4EF',
    applicationType: 'Permitted Development',
    documents: [
      {
        id: '4',
        name: 'Location Plan.pdf',
        type: 'application/pdf',
        size: 1048576,
        uploadDate: '2025-05-28',
        url: '/documents/location-plan.pdf'
      }
    ],
    timeline: [
      {
        id: '9',        title: 'Application Submitted',
        description: 'Your application has been received and assigned reference number PP-2025-010004',
        date: '2025-05-28',
        status: 'completed'
      },
      {
        id: '10',
        title: 'Initial Review',
        description: 'Application awaiting initial review',
        date: '2025-06-02',
        status: 'current'
      },
      {
        id: '11',
        title: 'Technical Assessment',
        description: 'Technical review will commence',
        date: '2025-06-10',
        status: 'pending'
      },
      {
        id: '12',
        title: 'Decision Notice',
        description: 'Final decision will be issued',
        date: '2025-06-25',
        status: 'pending'
      }
    ]
  }
]

export const getApplications = async (): Promise<Application[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500))
  return mockApplications
}

export const getApplicationById = async (id: string): Promise<Application | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  return mockApplications.find(app => app.id === id) || null
}

export const uploadDocument = async (file: File): Promise<Document> => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  const newDocument: Document = {
    id: Math.random().toString(36).substr(2, 9),
    name: file.name,
    type: file.type,
    size: file.size,
    uploadDate: new Date().toISOString(),
    url: `/documents/${file.name.toLowerCase().replace(/\s+/g, '-')}`
  }
  
  // In a real app, this would be sent to the server
  return newDocument
}
