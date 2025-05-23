/**
 * Entry point of the Power Supply Calculator web application.
 * Initializes the MVC components when the DOM is fully loaded.
 *
 * @module main
 */
import PSCalculatorModel from './PSCalculatorModel.js';
import PSCalculatorView from './PSCalculatorView.js';
import PSCalculatorController from './PSCalculatorController.js';

/**
 * Waits for the DOM to be fully loaded.
 * - Creates a new model instance to store hardware configuration and computer power consumption.
 * - Creates a view instance to handle UI rendering and user interaction.
 * - Creates a controller instance to link model and view logic.
 *
 * Logs initialization steps to the console.
 *
 * @function
 * @listens document:DOMContentLoaded
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing MVC...');

    /** @type {PSCalculatorModel} */
    const model = new PSCalculatorModel();

    /** @type {PSCalculatorView} */
    const view = new PSCalculatorView();

    /** @type {PSCalculatorController} */
    const controller = new PSCalculatorController(model, view);

    console.log('MVC Initialized', {model, view, controller});
});