import PSCalculatorModel from './PSCalculatorModel.js';
import PSCalculatorView from './PSCalculatorView.js';
import PSCalculatorController from './PSCalculatorController.js';

document.addEventListener('DOMContentLoaded', () => {
    const model = new PSCalculatorModel();
    const view = new PSCalculatorView();
    const controller = new PSCalculatorController(model, view);
});