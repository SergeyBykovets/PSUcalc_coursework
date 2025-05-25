import PSCalculatorController from '../../static/js/PSCalculatorController';

describe('PSCalculatorController', () => {
    let model, view, controller;

    beforeEach(() => {
        model = {
            setCpu: jest.fn(),
            setCpuOverclock: jest.fn(),
            addGpu: jest.fn(),
            setGpu: jest.fn(),
            setGpuOverclock: jest.fn(),
            removeGpu: jest.fn(),
            setRam: jest.fn(),
            setPci: jest.fn(),
            setStorage: jest.fn(),
            setOpticalDrive: jest.fn(),
            setFans: jest.fn(),
            reset: jest.fn(),
            calculatePower: jest.fn().mockReturnValue({ total: 100, recommended: 120 }),
        };

        view = {
            bindEvents: jest.fn(),
            cpuInput: document.createElement('input'),
            cpuDropdownContent: document.createElement('div'),
            cpuOptions: { options: [{ value: '65', text: 'Intel i5', getAttribute: () => '65' }], selectedIndex: 0 },
            cpuOverclockCheckbox: document.createElement('input'),
            cpuOverclockPercentage: document.createElement('input'),
            updatePower: jest.fn(),
            addGpuBlock: jest.fn(),
            bindGpuEvents: jest.fn(),
            gpuBlocks: [true],
            ramType: { value: 'DDR4', selectedOptions: [{ getAttribute: () => '5' }] },
            ramQuantity: { value: '2' },
            pciQuantities: [{ value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }],
            storageQuantities: [{ value: '1' }, { value: '1' }, { value: '1' }],
            opticalDriveType: { value: 'DVD', selectedOptions: [{ getAttribute: () => '25' }] },
            fanQuantity: { value: '3' },
            reset: jest.fn(),
            filterOptions: jest.fn(),
        };

        controller = new PSCalculatorController(model, view);
    });

    test('onCpuSelect updates model and view', () => {
        controller.onCpuSelect();
        expect(view.cpuInput.value).toBe('Intel i5');
        expect(model.setCpu).toHaveBeenCalledWith(65, 'Intel i5');
    });

    test('onCpuSelect does not update model when no option is selected', () => {
        view.cpuOptions = {options: [{value: '', text: 'Unknown'}], selectedIndex: 0};

        controller.onCpuSelect();

        expect(model.setCpu).not.toHaveBeenCalled();
        expect(view.cpuInput.value).toBe('');
        expect(view.cpuDropdownContent.style.display).not.toBe('none');
    });

    test('onCpuOverclockChange updates model and slider UI', () => {
        document.body.innerHTML = `
            <div id="cpuOverclockValue"></div>
            <div id="cpuOverclockSliderContainer"></div>
        `;
        view.cpuOverclockCheckbox.checked = true;
        view.cpuOverclockPercentage.value = '20';
        controller.onCpuOverclockChange();
        expect(model.setCpuOverclock).toHaveBeenCalledWith(true, 20);
    });

    test('onAddGpu increments count and updates view/model', () => {
        window.gpuOptionsHtml = '';
        window.STATIC_URL = '';
        controller.onAddGpu();
        expect(model.addGpu).toHaveBeenCalledWith(0, '');
        expect(view.addGpuBlock).toHaveBeenCalled();
    });

    test('onDeleteGpu updates model and rebinds handlers', () => {
        controller.onDeleteGpu(0);
        expect(model.removeGpu).toHaveBeenCalledWith(0);
        expect(view.bindGpuEvents).toHaveBeenCalled();
    });

    test('onRamChange updates model with RAM settings', () => {
        controller.onRamChange();
        expect(model.setRam).toHaveBeenCalledWith('DDR4', 2, 5);
    });

    test('onPciChange updates model with PCI settings', () => {
        controller.onPciChange();
        expect(model.setPci).toHaveBeenCalledWith(1, 2, 3, 4);
    });

    test('onStorageChange updates model with storage settings', () => {
        controller.onStorageChange();
        expect(model.setStorage).toHaveBeenCalledWith(1, 1, 1);
    });

    test('onFansChange updates model with fan count', () => {
        controller.onFansChange();
        expect(model.setFans).toHaveBeenCalledWith(3);
    });

    test('onReset resets model and view', () => {
        window.gpuOptionsHtml = '';
        window.STATIC_URL = '';
        controller.onReset();
        expect(model.reset).toHaveBeenCalled();
        expect(view.reset).toHaveBeenCalled();
    });

    test('updatePower fetches and sends data to view', () => {
        controller.updatePower();
        expect(view.updatePower).toHaveBeenCalledWith(100, 120);
    });

    test('onDocumentClick hides CPU dropdown when clicked outside', () => {
        document.body.innerHTML = '<div id="outside"></div>';
        const outside = document.getElementById('outside');
        view.cpuInput.contains = jest.fn(() => false);
        view.cpuDropdownContent.contains = jest.fn(() => false);
        controller.onDocumentClick({ target: outside });
        expect(view.cpuDropdownContent.style.display).toBe('none');
    });

    test('onGpuInputFocus filters GPU options', () => {
        const index = 0;
        document.body.innerHTML = `
            <input id="gpuInput0" value="RTX">
            <select id="gpuOptions0"><option>RTX 3060</option></select>
            <div id="gpuDropdownContent0"></div>
        `;
        controller.onGpuInputFocus(index);
        expect(view.filterOptions).toHaveBeenCalled();
    });

    test('onGpuSelect sets GPU in model and updates input', () => {
        const index = 0;
        document.body.innerHTML = `
            <select id="gpuOptions0">
                <option value="RTX" data-subtitle="150">RTX 3060</option>
            </select>
            <input id="gpuInput0">
            <div id="gpuDropdownContent0"></div>
        `;
        const gpuOptions = document.getElementById('gpuOptions0');
        gpuOptions.selectedIndex = 0;
        controller.onGpuSelect(index);
        expect(model.setGpu).toHaveBeenCalledWith(0, 150, 'RTX 3060');
        expect(document.getElementById('gpuDropdownContent0').style.display).toBe('none');
    });

    test('onGpuOverclockChange updates GPU overclock', () => {
        const index = 0;
        document.body.innerHTML = `
            <input id="gpuOverclockCheckbox0" type="checkbox" checked>
            <input id="gpuOverclockPercentage0" type="range" value="15">
            <span id="gpuOverclockValue0"></span>
            <div id="gpuOverclockSliderContainer0"></div>
        `;
        controller.onGpuOverclockChange(index);
        expect(model.setGpuOverclock).toHaveBeenCalledWith(0, true, 15);
    });

    test('onOpticalDriveChange updates model with optical drive info', () => {
        controller.onOpticalDriveChange();
        expect(model.setOpticalDrive).toHaveBeenCalledWith('DVD', 25);
    });

    test('deleteGpu event triggers onDeleteGpu', () => {
        const spy = jest.spyOn(controller, 'onDeleteGpu');
        const index = 1;
        window.dispatchEvent(new CustomEvent('deleteGpu', { detail: { index } }));
        expect(spy).toHaveBeenCalledWith(index);
    });

    test('onCpuInputFocus calls view.filterOptions', () => {
        controller.onCpuInputFocus();
        expect(view.filterOptions).toHaveBeenCalled();
    });

    test('onCpuInput calls view.filterOptions', () => {
        controller.onCpuInput();
        expect(view.filterOptions).toHaveBeenCalled();
    });
    test('onAddGpu sets index to 0 if no GPU blocks exist', () => {
        window.gpuOptionsHtml = '';
        window.STATIC_URL = '';
        controller.onAddGpu();
        expect(model.addGpu).toHaveBeenCalledWith(0, '');
    });

    test('onCpuSelect handles case with no selected option', () => {
        controller.onCpuSelect();

        expect(model.setCpu).not.toThrow;
    });

    test('onGpuSelect handles missing subtitle', () => {
        const index = 0;
        document.body.innerHTML = `
            <select id="gpuOptions0">
                <option value="RTX">RTX 4060</option>
            </select>
            <input id="gpuInput0">
            <div id="gpuDropdownContent0"></div>
        `;
        const gpuOptions = document.getElementById('gpuOptions0');
        gpuOptions.selectedIndex = 0;
        controller.onGpuSelect(index);
        expect(model.setGpu).toHaveBeenCalledWith(0, 0, 'RTX 4060');
    });

    test('onCpuOverclockChange hides slider container when unchecked', () => {
        document.body.innerHTML = `
        <div id="cpuOverclockValue"></div>
        <div id="cpuOverclockSliderContainer"></div>
        <input id="cpuOverclockPercentage" type="range" value="15">
        `;
        // Checkbox state is unchecked...
        view.cpuOverclockCheckbox.checked = false;
        view.cpuOverclockPercentage = document.getElementById('cpuOverclockPercentage');

        const sliderContainer = document.getElementById('cpuOverclockSliderContainer');

        controller.onCpuOverclockChange();

        expect(sliderContainer.style.display).toBe('none');
        expect(sliderContainer.classList.contains('active')).toBe(false);
    });

    test('onGpuInput filters GPU options', () => {
        const index = 0;
        document.body.innerHTML = `
            <input id="gpuInput${index}" value="RTX">
            <select id="gpuOptions${index}">
                <option value="RTX 3050">RTX 3050</option>
                <option value="RTX 3070">RTX 3070</option>
            </select>
            <div id="gpuDropdownContent${index}"></div>
        `;
        view.filterOptions = jest.fn();
        controller.onGpuInput(index);

        expect(view.filterOptions).toHaveBeenCalledWith(
            document.getElementById(`gpuInput${index}`),
            document.getElementById(`gpuOptions${index}`).options,
            document.getElementById(`gpuDropdownContent${index}`)
        );
    });

    test('onGpuOverclockChange hides slider container when unchecked', () =>{
        const index = 0;

        document.body.innerHTML = `
        <input id="gpuOverclockCheckbox${index}" type="checkbox">
        <input id="gpuOverclockPercentage${index}" type="range" value="15">
        <span id="gpuOverclockValue${index}"></span>
        <div id="gpuOverclockSliderContainer${index}"></div>
        `;

        const checkbox = document.getElementById(`gpuOverclockCheckbox${index}`);
        const sliderContainer = document.getElementById(`gpuOverclockSliderContainer${index}`);
        const valueDisplay = document.getElementById(`gpuOverclockValue${index}`);
        const slider = document.getElementById(`gpuOverclockPercentage${index}`);

        view.gpuOverclockCheckbox = checkbox;
        view.gpuOverclockPercentage = slider;

        checkbox.checked = false;

        controller.onGpuOverclockChange(index);

        expect(sliderContainer.style.display).toBe('none');
        expect(sliderContainer.classList.contains('active')).toBe(false);

        expect(valueDisplay.textContent).toBe(slider.value);

        expect(slider.style.background).toBe('');
        expect(model.setGpuOverclock).toHaveBeenCalledWith(index, false, 15);
    });


    test('onDocumentClick hides GPU dropdowns when clicked outside', () => {
        document.body.innerHTML = `
            <div id="outside"></div>
            <div class="gpu-block" id="gpuBlock0">
                <input id="gpuInput0">
                <div id="gpuDropdownContent0" style="display: block"></div>
            </div>
            <div class="gpu-block" id="gpuBlock1">
                <input id="gpuInput1">
                <div id="gpuDropdownContent1" style="display: block"></div>
            </div>
        `;

        const outside = document.getElementById('outside');

        // Mocking method contains for GPU input & dropdown
        document.getElementById('gpuInput0').contains = jest.fn(() => false);
        document.getElementById('gpuDropdownContent0').contains = jest.fn(() => false);
        document.getElementById('gpuInput1').contains = jest.fn(() => false);
        document.getElementById('gpuDropdownContent1').contains = jest.fn(() => false);

        controller.onDocumentClick({ target: outside });

        // Check if all GPUs dropdown became invisible
        expect(document.getElementById('gpuDropdownContent0').style.display).toBe('none');
        expect(document.getElementById('gpuDropdownContent1').style.display).toBe('none');
    });

     test('should not hide CPU dropdown if clicked inside', () => {
        const event = { target: view.cpuInput };
        controller.onDocumentClick(event);
        expect(view.cpuDropdownContent.style.display).not.toBe('none');
    });

    test('should hide CPU dropdown if clicked outside', () => {
        const event = { target: document.createElement('div') };
        controller.onDocumentClick(event);
        expect(view.cpuDropdownContent.style.display).toBe('none');
    });

    test('should not hide GPU dropdown if clicked inside', () => {
        const gpuInput = document.createElement('input');
        const gpuDropdownContent = document.createElement('div');
        gpuInput.id = 'gpuInput0';
        gpuDropdownContent.id = 'gpuDropdownContent0';
        document.body.appendChild(gpuInput);
        document.body.appendChild(gpuDropdownContent);

        const event = { target: gpuInput };
        controller.onDocumentClick(event);
        expect(gpuDropdownContent.style.display).not.toBe('none');
    });


});






