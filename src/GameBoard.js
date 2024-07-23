import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PossibleActions from './PossibleActions';
import './GameBoard.css';
import { ReactComponent as RiskMap } from './classic_map.svg';

const playerColors = ['red', 'lightblue', 'lightgreen', 'yellow', 'pink', 'orange'];

// Predefined positions for each territory with slightly reduced scaling
const territoryPositions = {
    "Alaska": { x: 85, y: 60 },
    "Northwest Territory": { x: 190, y: 60 },
    "Greenland": { x: 460, y: 20 },
    "Alberta": { x: 240, y: 105 },
    "Ontario": { x: 160, y: 105 },
    "Quebec": { x: 320, y: 110 },
    "Western United States": { x: 115, y: 165 },
    "Eastern United States": { x: 240, y: 195 },
    "Central America": { x: 160, y: 265 },
    "Venezuela": { x: 270, y: 315 },
    "Peru": { x: 270, y: 415 },
    "Brazil": { x: 340, y: 385 },
    "Argentina": { x: 290, y: 505 },
    "North Africa": { x: 550, y: 265 },
    "Egypt": { x: 640, y: 225 },
    "East Africa": { x: 720, y: 305 },
    "Congo": { x: 640, y: 355 },
    "South Africa": { x: 655, y: 435 },
    "Madagascar": { x: 750, y: 475 },
    "Western Europe": { x: 520, y: 145 },
    "Southern Europe": { x: 635, y: 155 },
    "Northern Europe": { x: 620, y: 120 },
    "Great Britain": { x: 520, y: 110 },
    "Scandinavia": { x: 610, y: 65 },
    "Ukraine": { x: 695, y: 105 },
    "Iceland": { x: 490, y: 75 },
    "Middle East": { x: 750, y: 200 },
    "Afghanistan": { x: 810, y: 135 },
    "Ural": { x: 800, y: 75 },
    "Siberia": { x: 865, y: 55 },
    "Yakutsk": { x: 970, y: 65 },
    "Irkutsk": { x: 950, y: 105 },
    "Kamchatka": { x: 1100, y: 65 },
    "Mongolia": { x: 970, y: 145 },
    "Japan": { x: 1135, y: 185 },
    "China": { x: 980, y: 205 },
    "India": { x: 880, y: 235 },
    "Siam": { x: 970, y: 265 },
    "Indonesia": { x: 1030, y: 345 },
    "New Guinea": { x: 1150, y: 345 },
    "Western Australia": { x: 1000, y: 465 },
    "Eastern Australia": { x: 1130, y: 445 }
};

const GameBoard = () => {
    const [gameState, setGameState] = useState(null);
    const [error, setError] = useState(null);
    const [watchMode, setWatchMode] = useState(false);

    const fetchGameState = () => {
        axios
            .get('http://localhost:8000/game-state')
            .then((response) => {
                setGameState(response.data.game_state);
                setError(response.data.error);
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    useEffect(() => {
        fetchGameState();
    }, []);

    useEffect(() => {
        if (watchMode) {
            const interval = setInterval(() => {
                fetchGameState();
            }, 250);

            return () => clearInterval(interval);
        }
    }, [watchMode]);

    const toggleWatchMode = () => {
        setWatchMode(!watchMode);
    };

    useEffect(() => {
        if (gameState) {
            // Get the root SVG element or a group element where text will be appended
            const svgElement = document.querySelector('.risk-map');
            if (!svgElement) {
                console.error('SVG element not found.');
                return;
            }
    
            // Clear any existing text elements
            svgElement.querySelectorAll('text, circle').forEach(el => el.remove());
    
            gameState.players.forEach((player, playerIndex) => {
                player.territories.forEach((territory) => {
                    // Use attribute selector to handle IDs with spaces
                    const territoryElements = document.querySelectorAll(`[id="${territory}"]`);
    
                    if (territoryElements.length > 0) {
                        territoryElements.forEach((territoryElement) => {
                            console.log(`Updating territory: ${territory}`);
                            territoryElement.setAttribute('fill', playerColors[playerIndex % playerColors.length]);
                            territoryElement.setAttribute('stroke', 'white');
                            territoryElement.setAttribute('stroke-width', '1');
                        });
    
                        // Use predefined positions for the text
                        const position = territoryPositions[territory];
                        if (position) {
                            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                            text.setAttribute('x', position.x);
                            text.setAttribute('y', position.y);
                            text.setAttribute('fill', 'black');
                            text.setAttribute('font-size', '12');
                            text.setAttribute('font-weight', '600');
                            text.setAttribute('text-anchor', 'middle');
                            text.setAttribute('dominant-baseline', 'middle');
                            
                            // Create tspan elements for line breaks
                            const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                            tspan1.setAttribute('x', position.x);
                            tspan1.setAttribute('dy', '1.2em'); // Vertical offset for first line
                            tspan1.textContent = territory;
    
                            const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
                            tspan2.setAttribute('x', position.x);
                            tspan2.setAttribute('dy', '1.2em'); // Vertical offset for second line
                            tspan2.textContent = player.armies[territory];
    
                            text.appendChild(tspan1);
                            text.appendChild(tspan2);
                            
                            // Append the text element to the SVG
                            svgElement.appendChild(text);
                            console.log(`Appended text: ${territory} (${player.armies[territory]})`);
                        } else {
                            console.warn(`Position not defined for territory: ${territory}`);
                        }
                    } else {
                        console.warn(`Territory not found: ${territory}`);
                    }
                });
            });
        }
    }, [gameState]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!gameState) {
        return <div>Loading...</div>;
    }

    const currentPlayer =
        gameState.players && gameState.players[gameState.current_turn];

    return (
        <div className="game-container">
            <div className="left-column">
                <div className="header">
                    <h1>"Risk" Game</h1>
                    <label className="watch-mode-toggle">
                        <input
                            type="checkbox"
                            checked={watchMode}
                            onChange={toggleWatchMode}
                        />
                        Watch Mode
                    </label>
                </div>
                <div className="map-container">
                    <RiskMap className="risk-map" />
                </div>
            </div>
            <div className="right-column">
                <div className="game-info">
                    <h2>Round: {gameState.round}</h2>
                    <h2>Active Player: {gameState.current_player}</h2>
                    <h2>Turn Phase: {gameState.turn_phase}</h2>
                    {currentPlayer && (
                        <div className="player-cards">
                            <h3>Current Player's Cards</h3>
                            <ul>
                                {currentPlayer.cards.map((card, index) => (
                                    <li key={index}>
                                        {card.territory
                                            ? `${card.territory} (${card.kind})`
                                            : `(${card.kind})`}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <PossibleActions
                        gameState={gameState}
                        fetchGameState={fetchGameState}
                        setError={setError}
                    />
                </div>
            </div>
        </div>
    );
};

export default GameBoard;