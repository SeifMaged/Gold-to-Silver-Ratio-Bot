const { loadState, saveState } = require('../utils/stateManager');

let state = loadState();

function getState() {
    return state;
}

function updateState(updates = {}) {
    state = {...state, ...updates};
    saveState(state);
    return state;
}

module.exports = { getState, updateState };