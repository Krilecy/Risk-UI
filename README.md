# Risk Game UI

A React-based user interface for interacting with a [Risk board game API](https://github.com/Krilecy/risk-board_game-server) implementation written in Rust. This UI provides a simple way to play the game and showcases the backend which is the actual star of the show.

## Features

- Interactive SVG-based game board showing territory ownership and army counts
- Real-time game state updates with observer mode
- Visual probability indicators for attack success
- Support for all core Risk game actions:
  - Reinforcing territories
  - Attacking neighboring territories
  - Fortifying positions
  - Trading cards
  - Auto-attack mode for quick conquests

## Prerequisites

- Node.js (v18 or higher recommended)
- npm
- The Risk game API server running locally (default: http://localhost:8000)

## Installation

1. Clone this repository
2. Navigate to the project directory
3. Install dependencies:
```bash
npm install
```
## Running the Application

Start the development server:
```bash
npm start
```

This will launch the application. You can access it in your browser at http://localhost:3000.

## Project Structure

- `src/GameBoard.js` - Main game board component with territory rendering and state management
- `src/PossibleActions.js` - Handles all game actions and API interactions
- `src/classic_map.svg` - SVG map of the Risk game board
- `src/App.js` - Root application component

## Technical Details

The UI makes use of several key technologies and features:

- SVG manipulation for dynamic territory coloring and army count display
- Axios for API communication
- Real-time game state polling in observer mode (200ms intervals)
- CSS Grid layout for responsive design
- Custom styling with semi-transparent overlay for better readability

## Building for Production

To create a production build:
```bash
npm run build
```

This will create an optimized build in the `build` folder ready for deployment.

## Contributing

Don't feel free to submit issues or enhancement requests. This is a personal project and I'm not looking for contributions. Honestly, If you want a better UI make a new one. This is just the showcase for the backend.

## License

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
Disclaimer: This is a non-commercial hobby project and not in any way affiliated with the copy write holders of the Risk board game.
