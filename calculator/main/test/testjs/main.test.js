jest.mock('../../static/js/PSCalculatorModel')
jest.mock('../../static/js/PSCalculatorView')
jest.mock('../../static/js/PSCalculatorController')

import PSCalculatorModel from "../../static/js/PSCalculatorModel.js";
import PSCalculatorController from "../../static/js/PSCalculatorController.js";
import PSCalculatorView from "../../static/js/PSCalculatorView.js";

describe('main.js initialization', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div>Some text</div>';
        PSCalculatorModel.mockClear();
        PSCalculatorView.mockClear();
        PSCalculatorController.mockClear();
    });

    test('should initialize MVC components on DOMContentLoaded event', () => {
        require('../../static/js/main')

        const event = new Event('DOMContentLoaded');
        document.dispatchEvent(event);

        expect(PSCalculatorModel).toHaveBeenCalledTimes(1);
        expect(PSCalculatorView).toHaveBeenCalledTimes(1);
        expect(PSCalculatorController).toHaveBeenCalledTimes(1);

        const modelInstance = PSCalculatorModel.mock.instances[0];
        const viewInstance = PSCalculatorView.mock.instances[0];
        expect(PSCalculatorController).toHaveBeenCalledWith(modelInstance, viewInstance);
    });
});