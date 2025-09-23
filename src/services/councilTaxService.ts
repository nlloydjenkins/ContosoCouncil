export interface Property {
  id: string
  address: string
  postcode: string
  propertyType: string
  councilTaxBand: string
  annualRate: number
  monthlyRate: number
  description: string
}

export interface CouncilTaxBand {
  band: string
  description: string
  annualRate: number
  monthlyRate: number
  relativeToBandD: string
}

// Mock council tax data for different properties
const mockProperties: Property[] = [
  {
    id: '1',
    address: '42 Greenfield Lane',
    postcode: 'EV4 2GH',
    propertyType: 'Detached House',
    councilTaxBand: 'D',
    annualRate: 1895.22,
    monthlyRate: 157.94,
    description: '3-bedroom detached house with garden'
  },
  {
    id: '2',
    address: '123 Oak Street',
    postcode: 'CT1 2AB',
    propertyType: 'Semi-Detached House',
    councilTaxBand: 'C',
    annualRate: 1684.19,
    monthlyRate: 140.35,
    description: '2-bedroom semi-detached house'
  },
  {
    id: '3',
    address: '789 Pine Road',
    postcode: 'CT3 4EF',
    propertyType: 'Terraced House',
    councilTaxBand: 'B',
    annualRate: 1473.17,
    monthlyRate: 122.76,
    description: '2-bedroom terraced house'
  },
  {
    id: '4',
    address: '15 Maple Close',
    postcode: 'CV5 8RT',
    propertyType: 'Flat',
    councilTaxBand: 'A',
    annualRate: 1262.15,
    monthlyRate: 105.18,
    description: '1-bedroom apartment'
  },
  {
    id: '5',
    address: '67 Elm Avenue',
    postcode: 'WX9 1QW',
    propertyType: 'Detached House',
    councilTaxBand: 'E',
    annualRate: 2317.27,
    monthlyRate: 193.11,
    description: '4-bedroom detached house with double garage'
  },
  {
    id: '6',
    address: '234 Birch Street',
    postcode: 'YZ2 5ER',
    propertyType: 'Detached House',
    councilTaxBand: 'F',
    annualRate: 2739.32,
    monthlyRate: 228.28,
    description: '5-bedroom detached house'
  }
]

// Council tax band information
const councilTaxBands: CouncilTaxBand[] = [
  {
    band: 'A',
    description: 'Up to £40,000',
    annualRate: 1262.15,
    monthlyRate: 105.18,
    relativeToBandD: '6/9'
  },
  {
    band: 'B',
    description: '£40,001 to £52,000',
    annualRate: 1473.17,
    monthlyRate: 122.76,
    relativeToBandD: '7/9'
  },
  {
    band: 'C',
    description: '£52,001 to £68,000',
    annualRate: 1684.19,
    monthlyRate: 140.35,
    relativeToBandD: '8/9'
  },
  {
    band: 'D',
    description: '£68,001 to £88,000',
    annualRate: 1895.22,
    monthlyRate: 157.94,
    relativeToBandD: '9/9'
  },
  {
    band: 'E',
    description: '£88,001 to £120,000',
    annualRate: 2317.27,
    monthlyRate: 193.11,
    relativeToBandD: '11/9'
  },
  {
    band: 'F',
    description: '£120,001 to £160,000',
    annualRate: 2739.32,
    monthlyRate: 228.28,
    relativeToBandD: '13/9'
  },
  {
    band: 'G',
    description: '£160,001 to £320,000',
    annualRate: 3161.37,
    monthlyRate: 263.45,
    relativeToBandD: '15/9'
  },
  {
    band: 'H',
    description: 'Over £320,000',
    annualRate: 3790.44,
    monthlyRate: 315.87,
    relativeToBandD: '18/9'
  }
]

export const councilTaxService = {
  // Search for properties by address or postcode
  searchProperties: async (query: string): Promise<Property[]> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    if (!query.trim()) {
      return []
    }
    
    const searchTerm = query.toLowerCase().trim()
    
    return mockProperties.filter(property => 
      property.address.toLowerCase().includes(searchTerm) ||
      property.postcode.toLowerCase().includes(searchTerm)
    )
  },

  // Get property by ID
  getPropertyById: async (id: string): Promise<Property | null> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return mockProperties.find(property => property.id === id) || null
  },

  // Get all council tax bands
  getCouncilTaxBands: async (): Promise<CouncilTaxBand[]> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return councilTaxBands
  },

  // Get council tax band information
  getCouncilTaxBand: async (band: string): Promise<CouncilTaxBand | null> => {
    await new Promise(resolve => setTimeout(resolve, 200))
    
    return councilTaxBands.find(b => b.band === band.toUpperCase()) || null
  }
}