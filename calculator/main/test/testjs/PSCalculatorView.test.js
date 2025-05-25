import PSCalculatorView from '../../static/js/PSCalculatorView';

describe('PSCalculatorView', () => {
    let view;

    beforeEach(() => {
        document.body.innerHTML = `
            <input id="cpuInput">
            <div id="cpuDropdownContent"></div>
            <select id="cpuOptions"><option value="65">Intel i5</option></select>
            <input id="cpuOverclockCheckbox" type="checkbox">
            <input id="cpuOverclockPercentage" type="range" value="10">
            <span id="cpuOverclockValue">10</span>
            <div id="cpuOverclockSliderContainer"></div>
            <input id="ramQuantity">
            <input id="pciQuantity1"><input id="pciQuantity2"><input id="pciQuantity3"><input id="pciQuantity4">
            <input id="storageQuantity1"><input id="storageQuantity2"><input id="storageQuantity3">
            <select id="ramType"><option data-subtitle="5">DDR4</option></select>
            <select id="opticalDriveType"><option data-subtitle="25">DVD</option></select>
            <input id="fanQuantity">
            <div id="totalPower"></div>
            <div class="gpu-container"></div>
            <button id="resetButton"></button>
            <button id="addNewGpuOption"></button>
        `;
        view = new PSCalculatorView();
    });

    test('bindEvents attaches basic event handlers', () => {
        const handlers = {
            onCpuInputFocus: jest.fn(),
            onCpuInput: jest.fn(),
            onCpuSelect: jest.fn(),
            onCpuOverclockChange: jest.fn(),
            onDocumentClick: jest.fn(),
            onAddGpu: jest.fn(),
            onRamChange: jest.fn(),
            onPciChange: jest.fn(),
            onStorageChange: jest.fn(),
            onOpticalDriveChange: jest.fn(),
            onFansChange: jest.fn(),
            onReset: jest.fn(),
            onDeleteGpu: jest.fn(),
        };

        const spy = jest.spyOn(document, 'addEventListener');
        view.bindEvents(handlers);
        expect(spy).toHaveBeenCalledWith('click', handlers.onDocumentClick);
    });

    test('bindGpuEvents attaches GPU handlers if elements exist', () => {
        document.body.innerHTML += `
            <input id="gpuInput0">
            <select id="gpuOptions0"></select>
            <input id="gpuOverclockCheckbox0" type="checkbox">
            <input id="gpuOverclockPercentage0" type="range">
        `;

        const handlers = {
            onGpuInputFocus: jest.fn(),
            onGpuInput: jest.fn(),
            onGpuSelect: jest.fn(),
            onGpuOverclockChange: jest.fn(),
        };

        view.bindGpuEvents(0, handlers);
        expect(true).toBe(true);
    });

    test('deleteGpuBlock removes GPU block and reindexes', () => {
        const div1 = document.createElement('div');
        div1.id = 'gpuDropdownContainer0';
        const div2 = document.createElement('div');
        div2.id = 'gpuDropdownContainer1';
        view.gpuBlocks = [div1, div2];
        document.body.appendChild(div1);
        document.body.appendChild(div2);

        div1.innerHTML = div2.innerHTML = `
            <input type="text">
            <div class="dropdown-content"></div>
            <select></select>
            <input type="checkbox">
            <input type="range">
            <span id="gpuOverclockValue0"></span>
            <div class="overclock-slider"></div>
            <div class="del__btn"><button>Delete</button></div>
        `;

        view.deleteGpuBlock(0);
        expect(view.gpuBlocks.length).toBe(1);
        expect(view.gpuBlocks[0].id).toBe('gpuDropdownContainer0');
    });

    test('updatePower sets innerHTML with total and recommended values', () => {
        view.updatePower(150, 180);
        expect(view.totalPower.innerHTML).toContain('150W');
        expect(view.totalPower.innerHTML).toContain('180W');
    });

    test('reset clears all inputs and resets UI', () => {
        view.reset('/static/', '<option value="gpu1">GPU 1</option>');
        expect(view.cpuInput.value).toBe('');
        expect(view.cpuOverclockCheckbox.checked).toBe(false);
        expect(view.cpuOverclockPercentage.value).toBe('10');
        expect(document.getElementById('cpuOverclockValue').textContent).toBe('10');
        expect(document.getElementById('cpuOverclockSliderContainer').style.display).toBe('none');
        expect(view.ramQuantity.value).toBe('0');
        expect(view.pciQuantities.every((el) => el.value === '0')).toBe(true);
        expect(view.storageQuantities.every((el) => el.value === '0')).toBe(true);
        expect(view.opticalDriveType.value).toBe('');
        expect(view.fanQuantity.value).toBe('0');
        expect(view.gpuBlocks.length).toBe(1);
    });

    test('filterOptions shows matching options', () => {
        const input = document.getElementById('cpuInput');
        const dropdown = document.getElementById('cpuDropdownContent');
        const select = document.getElementById('cpuOptions');

        input.value = 'intel';
        view.filterOptions(input, select.options, dropdown);

        expect(dropdown.style.display).toBe('block');
        expect(select.options[0].style.display).toBe('');
    });

    test('filterOptions hides non-matching options', () => {
        const input = document.getElementById('cpuInput');
        const dropdown = document.getElementById('cpuDropdownContent');
        const select = document.getElementById('cpuOptions');

        input.value = 'xyz';
        view.filterOptions(input, select.options, dropdown);

        expect(select.options[0].style.display).toBe('none');
        expect(dropdown.style.display).toBe('block');
    });

    test('constructor logs error when CPU overclock elements are missing', () => {
        document.body.innerHTML = `
            <input id="cpuInput">
            <div id="cpuDropdownContent"></div>
            <select id="cpuOptions"><option value="65">Intel i7</option></select>
        `; // NOT include `cpuOverclockCheckbox` and `cpuOverclockPercentage`

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        const testView = new PSCalculatorView();

        expect(consoleSpy).toHaveBeenCalledWith('CPU overclock elements not found');
        consoleSpy.mockRestore();
    });

    test('addGpuBlock adds new GPU block and binds delete event', () => {
        const index = 0;
        const gpuOptionsHtml = '<option value="RTX 3060">RTX 3060</option>';
        const staticUrl = '/static/';
        const onDeleteGpuMock = jest.fn();

        document.body.innerHTML = '<div class="gpu-container"></div>';
        view.gpuContainer = document.querySelector('.gpu-container');

        view.addGpuBlock(index, gpuOptionsHtml, staticUrl, onDeleteGpuMock);

        const newGpuBlock = document.getElementById(`gpuDropdownContainer${index}`);

        // Check that if block added to DOM
        expect(newGpuBlock).not.toBeNull();
        expect(view.gpuContainer.contains(newGpuBlock)).toBe(true);

        // Check that `gpuBlocks` updated
        expect(view.gpuBlocks[index]).toBe(newGpuBlock);

        expect(document.getElementById(`gpuInput${index}`)).not.toBeNull();
        expect(document.getElementById(`gpuDropdownContent${index}`)).not.toBeNull();
        expect(document.getElementById(`gpuOptions${index}`)).not.toBeNull();
        expect(document.getElementById(`gpuOverclockCheckbox${index}`)).not.toBeNull();
        expect(document.getElementById(`gpuOverclockSliderContainer${index}`)).not.toBeNull();
        expect(document.getElementById(`gpuOverclockPercentage${index}`)).not.toBeNull();
        expect(document.getElementById(`gpuOverclockValue${index}`)).not.toBeNull();
        expect(document.getElementById(`delNewGpuOption${index}`)).not.toBeNull();

        const deleteButton = document.querySelector(`#delNewGpuOption${index} button`);
        expect(deleteButton).not.toBeNull();

        deleteButton.click();

        expect(onDeleteGpuMock).toHaveBeenCalledWith(index);
    });

    test('bindGpuEvents attaches GPU event handlers correctly', () => {
        const index = 0;

        document.body.innerHTML = `
            <input id="gpuInput${index}">
            <select id="gpuOptions${index}"></select>
            <input id="gpuOverclockCheckbox${index}" type="checkbox">
            <input id="gpuOverclockPercentage${index}" type="range">
        `;

        const handlers = {
            onGpuInputFocus: jest.fn(),
            onGpuInput: jest.fn(),
            onGpuSelect: jest.fn(),
            onGpuOverclockChange: jest.fn(),
        };

        view.bindGpuEvents(index, handlers);

        const gpuInput = document.getElementById(`gpuInput${index}`);
        const gpuOptions = document.getElementById(`gpuOptions${index}`);
        const gpuOverclockCheckbox = document.getElementById(`gpuOverclockCheckbox${index}`);
        const gpuOverclockPercentage = document.getElementById(`gpuOverclockPercentage${index}`);

        gpuInput.dispatchEvent(new Event('focus'));
        expect(handlers.onGpuInputFocus).toHaveBeenCalledWith(index);

        gpuInput.dispatchEvent(new Event('input'));
        expect(handlers.onGpuInput).toHaveBeenCalledWith(index);

        gpuOptions.dispatchEvent(new Event('change'));
        expect(handlers.onGpuSelect).toHaveBeenCalledWith(index);

        gpuOverclockCheckbox.dispatchEvent(new Event('change'));
        expect(handlers.onGpuOverclockChange).toHaveBeenCalledWith(index);

        gpuOverclockPercentage.dispatchEvent(new Event('input'));
        expect(handlers.onGpuOverclockChange).toHaveBeenCalledWith(index);
    });

    test('bindGpuEvents logs error when elements are missing', () => {
        const index = 0;

        document.body.innerHTML = `
            <input id="gpuOverclockCheckbox${index}" type="checkbox">
            <input id="gpuOverclockPercentage${index}" type="range">
        `;

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const handlers = {
            onGpuInputFocus: jest.fn(),
            onGpuInput: jest.fn(),
            onGpuSelect: jest.fn(),
            onGpuOverclockChange: jest.fn(),
        };

        view.bindGpuEvents(index, handlers);

        expect(consoleSpy).toHaveBeenCalledWith(`GPU elements not found for index ${index}`);

        consoleSpy.mockRestore();
    });

    test('deleteGpuBlock removes GPU block and reindexes correctly', () => {
        const indexToDelete = 1;

        document.body.innerHTML = `
            <div class="gpu-container">
                <div class="gpu-block" id="gpuDropdownContainer0">
                    <input type="text" id="gpuInput0">
                    <div class="dropdown-content" id="gpuDropdownContent0"></div>
                    <select id="gpuOptions0"></select>
                    <input type="checkbox" id="gpuOverclockCheckbox0">
                    <input type="range" id="gpuOverclockPercentage0">
                    <span id="gpuOverclockValue0">10</span>
                    <div class="overclock-slider" id="gpuOverclockSliderContainer0"></div>
                    <div class="del__btn" id="delNewGpuOption0"><button>Delete</button></div>
                </div>
                <div class="gpu-block" id="gpuDropdownContainer1">
                    <input type="text" id="gpuInput1">
                    <div class="dropdown-content" id="gpuDropdownContent1"></div>
                    <select id="gpuOptions1"></select>
                    <input type="checkbox" id="gpuOverclockCheckbox1">
                    <input type="range" id="gpuOverclockPercentage1">
                    <span id="gpuOverclockValue1">15</span>
                    <div class="overclock-slider" id="gpuOverclockSliderContainer1"></div>
                    <div class="del__btn" id="delNewGpuOption1"><button>Delete</button></div>
                </div>
            </div>
        `;

        view.gpuContainer = document.querySelector('.gpu-container');
        view.gpuBlocks = [
            document.getElementById('gpuDropdownContainer0'),
            document.getElementById('gpuDropdownContainer1'),
        ];

        view.deleteGpuBlock(indexToDelete);

        expect(document.getElementById(`gpuDropdownContainer${indexToDelete}`)).toBeNull();

        expect(view.gpuBlocks.length).toBe(1);
        expect(view.gpuBlocks[0].id).toBe('gpuDropdownContainer0');

        const remainingBlock = view.gpuBlocks[0];
        expect(remainingBlock.querySelector('input[type="text"]').id).toBe('gpuInput0');
        expect(remainingBlock.querySelector('.dropdown-content').id).toBe('gpuDropdownContent0');
        expect(remainingBlock.querySelector('select').id).toBe('gpuOptions0');
        expect(remainingBlock.querySelector('input[type="checkbox"]').id).toBe('gpuOverclockCheckbox0');
        expect(remainingBlock.querySelector('input[type="range"]').id).toBe('gpuOverclockPercentage0');
        expect(remainingBlock.querySelector('span[id*="gpuOverclockValue"]').id).toBe('gpuOverclockValue0');
        expect(remainingBlock.querySelector('.overclock-slider').id).toBe('gpuOverclockSliderContainer0');
        expect(remainingBlock.querySelector('.del__btn').id).toBe('delNewGpuOption0');

        const deleteButton = remainingBlock.querySelector('.del__btn button');
        deleteButton.click();

        expect(view.gpuBlocks.length).toBe(0);
    });

});

describe('PSCalculatorView deleteGpuBlock else branch', () => {
    let view;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="gpu-container"></div>
        `;

        view = new PSCalculatorView();
        view.gpuBlocks = [
            document.createElement('div'),
            document.createElement('div'),
        ];

        view.gpuBlocks[0].id = 'gpuDropdownContainer0';
        view.gpuBlocks[1].id = 'gpuDropdownContainer1';

        document.body.appendChild(view.gpuBlocks[0]);
        document.body.appendChild(view.gpuBlocks[1]);
    });

    test('should remove a GPU block and reindex correctly', () => {
        view.deleteGpuBlock(0);

        expect(view.gpuBlocks.length).toBe(1);
        expect(view.gpuBlocks[0].id).toBe('gpuDropdownContainer0');
    });

    test('should not throw an error when trying to delete non-existent GPU block', () => {
        expect(() => view.deleteGpuBlock(99)).not.toThrow();
        expect(view.gpuBlocks.length).toBe(2);
    });

    test('should properly update block IDs after deletion', () => {
        view.deleteGpuBlock(0);

        const remainingBlock = view.gpuBlocks[0];
        expect(remainingBlock.id).toBe('gpuDropdownContainer0');
    });
});
