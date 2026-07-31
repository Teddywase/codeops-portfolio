
## How to Open the Site

1. **Clone or download** this repository to your computer
2. **Open `index.html`** in your web browser (double-click the file)
3. Use the navigation links at the top of each page to switch between:
   - **Reservations** (index.html) - Book a table
   - **Contact** (contact.html) - Send a message or view hours

> No server required - this is a static HTML site that runs directly in your browser.

## Accessibility Features Implemented

| Feature | Implementation |
|---------|---------------|
| **Semantic HTML** | `header`, `nav`, `main`, `footer`, `fieldset`, `legend` |
| **Labels** | Every form input has a real `<label>` with matching `for` and `id` attributes |
| **Table Accessibility** | `<caption>` and `scope="col"` on all table headers |
| **Image Accessibility** | Meaningful `alt` attribute on hero image |
| **Iframe Accessibility** | `title` attribute on Google Map iframe |
| **Keyboard Navigation** | Full tab order through all interactive elements (no focus traps) |
| **Form Validation** | Built-in HTML5 validation (required, pattern, min/max) |
| **Heading Hierarchy** | Proper heading structure: `h1` → `h2` → `h3` (where applicable) |
| **Lazy Loading** | `loading="lazy"` on images and iframe for performance |
| **Meta Data** | Unique `<title>` and `<meta description>` on each page |

## Pages Overview

### index.html - Reservation Page
- **Reservation Form** with:
  - Full name (text input, required)
  - Telephone (pattern: `09xxxxxxxx` - exactly 10 digits starting with 09)
  - Guests (number input, min 1, max 20)
  - Date (date picker, required)
- **Menu Table** with:
  - Caption: "🇪🇹 Our menu · prices in ETB"
  - Column headers with `scope="col"`
  - ETB (Ethiopian Birr) price column
  - Ethiopian dishes: Doro Wat, Tibs, Vegetarian Combo
- **Hero Image** with meaningful alt text and lazy loading
- **Google Map Iframe** with title attribute showing restaurant location
- **Shared Navigation** linking to contact page

### contact.html - Contact Page
- **Contact Form** with:
  - Name (text input, required)
  - Email (email input, required, built-in validation)
  - Message (textarea, required)
- **Opening Hours Table** with:
  - Caption: "Our opening hours"
  - Day and Hours columns with `scope="col"`
  - Operating hours for Monday-Sunday
- **Shared Navigation** linking back to reservations page

## 🔧 Validation & Standards

-  **W3C Validator**: Zero errors (tested at validator.w3.org)
-  **Keyboard Operable**: All functionality accessible without a mouse
-  **Semantic HTML**: Proper use of HTML5 structural elements
-  **Accessible**: Follows WCAG 2.1 guidelines for forms, tables, and images

## Testing

1. **Keyboard Test**: Tab through the entire page with no mouse
   - Focus order: navigation → form fields → submit button → iframe
   - No focus traps - you can tab out of everything

2. **Form Validation Test**:
   - Try submitting without filling fields → browser shows validation messages
   - Phone field accepts only `09xxxxxxxx` format
   - Guests field accepts only numbers 1-20

3. **Navigation Test**: Click "Reservations" and "Contact" links to switch pages

## Dependencies

- None - pure HTML (no CSS or JavaScript required)
- Google Maps iframe loads external content

## Author

**IET College Canada**  
CodeOps - Full Stack Software Development

## License

This project is created for educational purposes as part of the CodeOps curriculum.