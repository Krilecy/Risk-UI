// src/GraphComponent.js
import React from 'react';
import { Graph } from 'react-d3-graph';

const playerColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];

// Define the geographical layout for the Risk game board
const territoryPositions = {
    "Alaska": { x: 50, y: 90 },
    "Northwest Territory": { x: 100, y: 105 },
    "Greenland": { x: 250, y: 10 },
    "Alberta": { x: 100, y: 145 },
    "Ontario": { x: 150, y: 155 },
    "Quebec": { x: 200, y: 140 },
    "Western United States": { x: 90, y: 200 },
    "Eastern United States": { x: 150, y: 220 },
    "Central America": { x: 100, y: 250 },
    "Venezuela": { x: 130, y: 300 },
    "Peru": { x: 130, y: 350 },
    "Brazil": { x: 180, y: 325 },
    "Argentina": { x: 130, y: 400 },
    "North Africa": { x: 300, y: 300 },
    "Egypt": { x: 370, y: 270 },
    "East Africa": { x: 400, y: 320 },
    "Congo": { x: 350, y: 350 },
    "South Africa": { x: 350, y: 400 },
    "Madagascar": { x: 420, y: 380 },
    "Western Europe": { x: 300, y: 170 },
    "Southern Europe": { x: 340, y: 190 },
    "Northern Europe": { x: 350, y: 150 },
    "Great Britain": { x: 300, y: 140 },
    "Scandinavia": { x: 320, y: 100 },
    "Ukraine": { x: 400, y: 120 },
    "Iceland": { x: 300, y: 50 },
    "Middle East": { x: 400, y: 220 },
    "Afghanistan": { x: 450, y: 170 },
    "Ural": { x: 450, y: 90 },
    "Siberia": { x: 470, y: 50 },
    "Yakutsk": { x: 570, y: 70 },
    "Irkutsk": { x: 550, y: 100 },
    "Kamchatka": { x: 650, y: 50 },
    "Mongolia": { x: 540, y: 150 },
    "Japan": { x: 600, y: 170 },
    "China": { x: 540, y: 200 },
    "India": { x: 450, y: 250 },
    "Siam": { x: 550, y: 290 },
    "Indonesia": { x: 550, y: 320 },
    "New Guinea": { x: 600, y: 350 },
    "Western Australia": { x: 550, y: 380 },
    "Eastern Australia": { x: 600, y: 400 }
};

const getGraphData = (gameState) => {
    if (!gameState) {
        return { nodes: [], links: [] };
    }

    const nodes = [];
    const links = [];

    // Create nodes for territories
    for (const territoryName in gameState.board.territories) {
        const player = gameState.players.find((player) =>
            player.territories.includes(territoryName)
        );
        const color = playerColors[player.id % playerColors.length];
        const label = `${territoryName} (${player.armies[territoryName]})`;

        const position = territoryPositions[territoryName];
        if (position) {
            nodes.push({ id: territoryName, label, color, ...position });
        }
    }

    // Create links for adjacent territories
    for (const territoryName in gameState.board.territories) {
        const territory = gameState.board.territories[territoryName];
        territory.adjacent_territories.forEach((adjacent) => {
            links.push({ source: territoryName, target: adjacent });
        });
    }

    return { nodes, links };
};

const GraphComponent = ({ gameState }) => {
    const graphData = getGraphData(gameState);

    const myConfig = {
        nodeHighlightBehavior: true,
        node: {
            size: 250,
            highlightStrokeColor: 'blue',
            labelProperty: 'label',
            fontColor: 'black',
            fontSize: 12,
            fontWeight: 'bold',
            renderLabel: true,
        },
        link: {
            highlightColor: 'lightblue',
        },
        directed: false,
        height: 800,
        width: 1000,
        staticGraph: true,
        d3: {
            alphaTarget: 0.05,
            gravity: -100,
            linkLength: 100,
            linkStrength: 1,
        },
    };

    return (
        <div>
            <Graph id="graph-id" data={graphData} config={myConfig}/>
        </div>
    );
};

export default GraphComponent;