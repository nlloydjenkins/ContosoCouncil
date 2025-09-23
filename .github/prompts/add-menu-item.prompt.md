---
mode: "ask"
model: "Claude Sonnet 4"
description: "Add a new menu item to the top navigation bar"
---

# Add New Menu Item to Top Navigation

Generate a complete implementation to add a new menu item to the top navigation bar in the Contoso Council planning application.

## Requirements

Please specify:

- **Menu Label**: What should the menu item be called? (e.g., "Contact Us", "About", "Services")
- **URL Path**: What route should it use? (e.g., "/contact", "/about", "/services")
- **Icon**: Which Material-UI icon should be used? (e.g., ContactMail, Info, Business)
- **Page Content**: Brief description of what the page should contain

## Implementation Steps

Based on your requirements, I will:

### 1. Update Header Navigation

- Add the new menu item to `src/components/Header.tsx`
- Import the required Material-UI icon
- Add the item to the `navItems` array following the existing pattern

### 2. Create New Page Component

- Create a new React component in `src/pages/`
- Follow the established design patterns using:
  - `nature-bg` class for background
  - `nature-card` class for content cards
  - Material-UI Typography and layout components
  - Consistent color scheme and styling

### 3. Add Route Configuration

- Update `src/App.tsx` to include the new route
- Import the new page component
- Add the route to the Routes configuration

## Current Navigation Structure

The existing menu items are:

- Home (`/`) - Home icon
- My Applications (`/my-applications`) - Assignment icon
- How It Works (`/how-it-works`) - Info icon
- Upload Documents (`/upload`) - CloudUpload icon

## Design Guidelines

The new page will follow these established patterns:

- Responsive design that works on mobile and desktop
- Nature/eco theme with green color palette
- Material-UI components for consistency
- Accessible navigation with proper ARIA labels
- Smooth hover animations and active state styling

## Example Usage

**Input**: "Add a Contact Us menu item with ContactMail icon at /contact route"

**Output**: Complete code changes including:

- Updated `src/components/Header.tsx` with new menu item
- New `src/pages/ContactUs.tsx` component with contact information
- Updated `src/App.tsx` with routing configuration
- Consistent styling and user experience

Please provide your menu item requirements and I'll generate the complete implementation!
