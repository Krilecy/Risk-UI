import React, { useState } from 'react';
import axios from 'axios';
import './PossibleActions.css';

const PossibleActions = ({ gameState, fetchGameState, setError }) => {
    const [numUnits, setNumUnits] = useState(1);

    const handleAction = (action) => {
        let request = null;

        switch (action.type) {
            case 'Reinforce':
                request = axios.post('http://localhost:8000/reinforce', {
                    player_id: gameState.current_turn,
                    territory: action.territory,
                    num_armies: numUnits,
                });
                break;
            case 'Attack':
                request = axios.post('http://localhost:8000/attack', {
                    player_id: gameState.current_turn,
                    from_territory: action.from,
                    to_territory: action.to,
                    num_dice: numUnits,
                });
                break;
            case 'Fortify':
                request = axios.post('http://localhost:8000/fortify', {
                    player_id: gameState.current_turn,
                    from_territory: action.from,
                    to_territory: action.to,
                    num_armies: numUnits,
                });
                break;
            case 'MoveArmies':
                request = axios.post('http://localhost:8000/move_armies', {
                    player_id: gameState.current_turn,
                    from_territory: action.from,
                    to_territory: action.to,
                    num_armies: numUnits,
                });
                break;
            case 'TradeCards':
                request = axios.post('http://localhost:8000/trade_cards', {
                    player_id: gameState.current_turn,
                    card_indices: action.card_indices,
                });
                break;
            case 'End Phase':
                request = axios.post('http://localhost:8000/advance_phase');
                break;
            default:
                console.error('Unknown action type:', action.type);
        }

        if (request) {
            request
                .then((response) => {
                    fetchGameState();
                    setNumUnits(1);
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    };

    const actionGroups = gameState.possible_actions.reduce((groups, action) => {
        if (typeof action === 'string') {
            if (!groups['End Phase']) {
                groups['End Phase'] = [];
            }
            groups['End Phase'].push(action);
        } else {
            const actionType = Object.keys(action)[0];
            if (!groups[actionType]) {
                groups[actionType] = [];
            }
            groups[actionType].push(action[actionType]);
        }
        return groups;
    }, {});

    const currentPlayer = gameState.players[gameState.current_turn];

    return (
        <div className="actions-container">
            {Object.keys(actionGroups).map((actionType, index) => (
                <div key={index}>
                    <h3>{actionType === 'AdvancePhase' ? 'End Phase' : actionType}</h3>
                    <ul>
                        {actionGroups[actionType].map((actionDetails, idx) => (
                            <li key={idx}>
                                <div className="action-content">
                                    <div className="action-text">
                                        {typeof actionDetails === 'string' ? (
                                            <span>{actionDetails}</span>
                                        ) : (
                                            Object.keys(actionDetails).map((key, idy) => (
                                                key !== 'max_dice' && key !== 'max_armies' && key !== 'card_indices' && (
                                                    <div key={idy}>
                                                        {key === 'from' || key === 'to' ? (
                                                            <span>
                                                                {actionDetails[key]}
                                                                {key === 'from' && (
                                                                    <span className="arrow">
                                                                        &darr;
                                                                    </span>
                                                                )}
                                                            </span>
                                                        ) : (
                                                            key !== 'type' && <span>{actionDetails[key]}</span>
                                                        )}
                                                    </div>
                                                )
                                            ))
                                        )}
                                    </div>
                                    <div className="action-controls">
                                        {typeof actionDetails !== 'string' && (
                                            (actionType === 'Reinforce' ||
                                                actionType === 'Attack' ||
                                                actionType === 'Fortify' ||
                                                actionType === 'MoveArmies') && (
                                                <select
                                                    value={numUnits}
                                                    onChange={(e) =>
                                                        setNumUnits(parseInt(e.target.value))
                                                    }
                                                >
                                                    {Array.from(
                                                        {
                                                            length:
                                                                actionType === 'Attack'
                                                                    ? actionDetails.max_dice
                                                                    : actionDetails.max_armies,
                                                        },
                                                        (_, i) => i + 1
                                                    ).map((num) => (
                                                        <option key={num} value={num}>
                                                            {num} {actionType === 'Attack' ? 'Dice' : 'Armies'}
                                                        </option>
                                                    ))}
                                                </select>
                                            )
                                        )}
                                        {actionType === 'TradeCards' ? (
                                            <div className="cards">
                                                {actionDetails.card_indices.map((cardIndex) => (
                                                    <span key={cardIndex}>
                                                        {currentPlayer.cards[cardIndex].territory} ({currentPlayer.cards[cardIndex].kind})
                                                    </span>
                                                ))}
                                            </div>
                                        ) : null}
                                        <button
                                            onClick={() =>
                                                handleAction({
                                                    ...actionDetails,
                                                    type: actionType,
                                                })
                                            }
                                        >
                                            Execute
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default PossibleActions;