# Fayette County AI Search

A modern, responsive search interface that provides intelligent search results for Fayette County government services. The application features real-time search with debounced API calls, keyboard navigation, and a clean, accessible user interface.

## Features

- **Real-time Search**: As-you-type search with 1-second debouncing
- **Keyboard Navigation**: Use arrow keys to navigate results, Enter to select, Escape to close
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Accessibility**: Full keyboard support and screen reader friendly
- **Modern UI**: Clean, dark theme with smooth animations
- **External Links**: Results open in new tabs for seamless browsing

## How It Works

1. **Input Handling**: The search input captures user queries with real-time filtering
2. **API Integration**: Queries are sent to `temp.json` (simulating an API endpoint)
3. **Result Filtering**: Results are filtered client-side based on query matching
4. **Display**: Results show phrase, subtext, and URL with clickable links

## Technical Details

### Architecture

- **Frontend**: Vanilla JavaScript with ES6+ features
- **Styling**: CSS3 with responsive breakpoints
- **Data**: JSON-based API response structure
- **No Dependencies**: Pure HTML, CSS, and JavaScript

### Key Components

#### SearchInterface Class

- Handles all search functionality and user interactions
- Implements debouncing for API calls (1000ms delay)
- Manages keyboard navigation and selection states
- Provides loading states and error handling

#### Data Structure

```json
{
  "success": boolean,
  "best_matches": [
    {
      "task_id": "string",
      "phrase": "string",
      "subtext": "string",
      "url": "string",
      "similarity_score": number
    }
  ]
}
```

### Search Logic

- Minimum 3 characters required to trigger search
- Case-insensitive matching on phrase and subtext
- Results filtered client-side for performance
- Previous results cached for better UX

## File Structure

```
api-search/
├── index.html          # Main HTML file
├── assets/
│   ├── scripts.js      # Search functionality
│   └── styles.css      # Responsive styling
├── temp.json           # Sample API data
└── README.md          # This file
```

## Usage

1. Open `index.html` in a web browser
2. Type your search query (minimum 3 characters)
3. Use arrow keys to navigate results
4. Click or press Enter to open selected result
5. Press Escape to close the dropdown

## Browser Support

- Chrome/Chromium (recommended)
- Firefox
- Safari
- Edge

## Development

The application is designed to be easily extensible:

- Replace `temp.json` with actual API endpoint
- Modify search logic in `fetchSearchResults()`
- Customize styling in `styles.css`
- Add additional features to `SearchInterface` class

## License

This project is open source and available under the MIT License.
