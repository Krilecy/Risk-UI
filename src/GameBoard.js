import React, { useEffect, useState } from 'react';
import axios from 'axios';
import GraphComponent from './GraphComponent';
import PossibleActions from './PossibleActions';
import './GameBoard.css';

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
                <GraphComponent gameState={gameState}/>
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