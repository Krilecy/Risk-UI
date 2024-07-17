import React, { useState } from 'react';
import axios from 'axios';
import './PossibleActions.css';

const PossibleActions = ({ gameState, fetchGameState, setError }) => {
    const [selectedAction, setSelectedAction] = useState(null);
    const [numUnits, setNumUnits] = useState(1);

    const handleAction = () => {
        if (!selectedAction) return;

        let request = null;

        switch (selectedAction.type) {
            case 'Reinforce':
                request = axios.post('http://localhost:8000/reinforce', {
                    player_id: gameState.current_turn,
                    territory: selectedAction.territory,
                    num_armies: numUnits,
                });
                break;
            case 'Attack':
                request = axios.post('http://localhost:8000/attack', {
                    attacker_id: gameState.current_turn,
                    from_territory: selectedAction.from,
                    to_territory: selectedAction.to,
                    num_dice: numUnits,
                });
                break;
            case 'Fortify':
                request = axios.post('http://localhost:8000/fortify', {
                    player_id: gameState.current_turn,
                    from_territory: selectedAction.from,
                    to_territory: selectedAction.to,
                    num_armies: numUnits,
                });
                break;
            case 'MoveArmies':
                request = axios.post('http://localhost:8000/move_armies', {
                    player_id: gameState.current_turn,
                    from_territory: selectedAction.from,
                    to_territory: selectedAction.to,
                    num_armies: numUnits,
                });
                break;
            case 'TradeCards':
                request = axios.post('http://localhost:8000/trade_cards', {
                    player_id: gameState.current_turn,
                    card_indices: [0, 1, 2], // Replace with selected card indices
                });
                break;
            case 'AdvancePhase':
                request = axios.post('http://localhost:8000/advance_phase');
                break;
            default:
                console.error('Unknown action type:', selectedAction.type);
        }

        if (request) {
            request
                .then((response) => {
                    fetchGameState();
                    setSelectedAction(null);
                    setNumUnits(1);
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    };

    return (
        <div className="actions-container">
            <h3>Possible Actions</h3>
            <ul>
                {gameState.possible_actions &&
                    gameState.possible_actions.map((action, index) => {
                        if (action === 'EndPhase') {
                            return (
                                <li key={index}>
                                    <div>
                                        <strong>Action: </strong>End Phase
                                        <button
                                            onClick={() =>
                                                setSelectedAction({
                                                    type: 'AdvancePhase',
                                                })
                                            }
                                        >
                                            Execute
                                        </button>
                                    </div>
                                </li>
                            );
                        }
                        const actionType = Object.keys(action)[0];
                        const actionDetails = action[actionType];
                        return (
                            <li key={index}>
                                <div>
                                    <strong>{actionType}</strong>
                                    {actionType !== 'TradeCards' &&
                                        actionType !== 'EndPhase' && (
                                            <div>
                                                {Object.keys(actionDetails).map(
                                                    (key, idx) => (
                                                        <div key={idx}>
                                                            <label>{key}: </label>
                                                            {typeof actionDetails[key] ===
                                                                'number' ? (
                                                                <span>{actionDetails[key]}</span>
                                                            ) : (
                                                                <span>{actionDetails[key]}</span>
                                                            )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    {(actionType === 'Reinforce' ||
                                        actionType === 'Attack' ||
                                        actionType === 'Fortify' ||
                                        actionType === 'MoveArmies') && (
                                            <div>
                                                <label htmlFor={`numUnits-${index}`}>
                                                    Number of{' '}
                                                    {actionType === 'Attack'
                                                        ? 'Dice'
                                                        : 'Armies'}:{' '}
                                                </label>
                                                <select
                                                    id={`numUnits-${index}`}
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
                                                            {num}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    <button
                                        onClick={() =>
                                            setSelectedAction({
                                                ...actionDetails,
                                                type: actionType,
                                            })
                                        }
                                    >
                                        Execute
                                    </button>
                                </div>
                            </li>
                        );
                    })}
            </ul>
            {selectedAction && (
                <div className="execute-container">
                    <h4>Executing Action: {selectedAction.type}</h4>
                    <button onClick={handleAction}>Confirm</button>
                </div>
            )}
        </div>
    );
};
export default PossibleActions;