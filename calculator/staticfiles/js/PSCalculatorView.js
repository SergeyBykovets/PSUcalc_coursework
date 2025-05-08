class PSCalculatorView {
    constructor() {
        this.cpuInput = document.getElementById('cpuInput');
        this.cpuDropdownContent = document.getElementById('cpuDropdownContent');
        this.cpuOptions = document.getElementById('cpuOptions');
        this.cpuOverclockCheckbox = document.getElementById('cpuOverclockCheckbox');
        this.cpuOverclockPercentage = document.getElementById('cpuOverclockPercentage');
        this.gpuContainer = document.querySelector('.gpu-container');
        this.addNewGpuButton = document.getElementById('addNewGpuOption');
        this.ramType = document.getElementById('ramType');
        this.ramQuantity = document.getElementById('ramQuantity');
        this.pciQuantities = [
            document.getElementById('pciQuantity1'),
            document.getElementById('pciQuantity2'),
            document.getElementById('pciQuantity3'),
            document.getElementById('pciQuantity4'),
        ];
        this.storageQuantities = [
            document.getElementById('storageQuantity1'),
            document.getElementById('storageQuantity2'),
            document.getElementById('storageQuantity3'),
        ];
        this.opticalDriveType = document.getElementById('opticalDriveType');
        this.fanQuantity = document.getElementById('fanQuantity');
        this.totalPower = document.getElementById('totalPower');
        this.resetButton = document.getElementById('resetButton');
        this.gpuBlocks = [];

        // Перевірка наявності елементів
        if (!this.cpuOverclockCheckbox || !this.cpuOverclockPercentage) {
            console.error('CPU overclock elements not found');
        }
    }

    bindEvents(handlers) {
        console.log('Binding events:', handlers);
        this.cpuInput.addEventListener('focus', handlers.onCpuInputFocus);
        this.cpuInput.addEventListener('input', handlers.onCpuInput);
        this.cpuOptions.addEventListener('change', handlers.onCpuSelect);
        this.cpuOverclockCheckbox.addEventListener('change', handlers.onCpuOverclockChange);
        this.cpuOverclockPercentage.addEventListener('input', handlers.onCpuOverclockChange);
        document.addEventListener('click', handlers.onDocumentClick);

        this.addNewGpuButton.addEventListener('click', handlers.onAddGpu);
        this.bindGpuEvents(0, handlers);

        this.ramType.addEventListener('change', handlers.onRamChange);
        this.ramQuantity.addEventListener('input', handlers.onRamChange);

        this.pciQuantities.forEach((input) => input.addEventListener('input', handlers.onPciChange));

        this.storageQuantities.forEach((input) => input.addEventListener('input', handlers.onStorageChange));

        this.opticalDriveType.addEventListener('change', handlers.onOpticalDriveChange);

        this.fanQuantity.addEventListener('input', handlers.onFansChange);

        this.resetButton.addEventListener('click', handlers.onReset);
    }

    bindGpuEvents(index, handlers) {
        const gpuInput = document.getElementById(`gpuInput${index}`);
        const gpuOptions = document.getElementById(`gpuOptions${index}`);
        const gpuOverclockCheckbox = document.getElementById(`gpuOverclockCheckbox${index}`);
        const gpuOverclockPercentage = document.getElementById(`gpuOverclockPercentage${index}`);

        gpuInput.addEventListener('focus', () => handlers.onGpuInputFocus(index));
        gpuInput.addEventListener('input', () => handlers.onGpuInput(index));
        gpuOptions.addEventListener('change', () => handlers.onGpuSelect(index));
        gpuOverclockCheckbox.addEventListener('change', () => handlers.onGpuOverclockChange(index));
        gpuOverclockPercentage.addEventListener('input', () => handlers.onGpuOverclockChange(index));
    }

    addGpuBlock(index, gpuOptionsHtml, staticUrl) {
        console.log('Adding GPU block:', index);
        const newGpuBlock = document.createElement('div');
        newGpuBlock.classList.add('form-group', 'dropdown-container', 'gpu-block');
        newGpuBlock.id = `gpuDropdownContainer${index}`;
        newGpuBlock.innerHTML = `
            <div class="template__three-select-filters">
                <div class="category">
                    <div class="category__title category--show">
                        <img src="${STATIC_URL}images/gpu2.png" />
                        <div class="title__text">GPU</div>
                    </div>
                </div>
                <div class="filter">
                    <input type="text" id="gpuInput${index}" placeholder="Enter GPU Model" />
                    <div class="dropdown-content" id="gpuDropdownContent${index}" style="display: none;">
                        <select size="10" id="gpuOptions${index}" class="gpu-options">
                            ${gpuOptionsHtml}
                        </select>
                    </div>
                    <div class="overclock-section">
                        <label>
                            <input type="checkbox" id="gpuOverclockCheckbox${index}"> Overclock
                        </label>
                        <div class="overclock-slider" id="gpuOverclockSliderContainer${index}" style="display: none;">
                            <label for="gpuOverclockPercentage${index}"> <span id="gpuOverclockValue${index}">10</span> % </label>
                            <input type="range" id="gpuOverclockPercentage${index}" min="0" max="25" value="10">
                        </div>
                    </div>
                </div>
            </div>
            <div class="del__btn" id="delNewGpuOption${index}">
                <button><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
        `;
        this.gpuContainer.appendChild(newGpuBlock);
        this.gpuBlocks[index] = newGpuBlock;

        document.getElementById(`delNewGpuOption${index}`).querySelector('button').addEventListener('click', () => {
            console.log('Delete button clicked for GPU:', index);
            handlers.onDeleteGpu(index);
        });
    }

    updatePower(total, recommended) {
        console.log('Updating UI with:', { total, recommended });
        this.totalPower.innerHTML = `
            The system consumes: <strong>${total}W</strong><br>
            Recommended power supply: <strong>${recommended}W</strong>
        `;
    }

    reset(staticUrl, gpuOptionsHtml) {
        console.log('Resetting view...');
        this.cpuInput.value = '';
        this.cpuOptions.value = '';
        this.cpuDropdownContent.style.display = 'none';
        this.cpuOverclockCheckbox.checked = false;
        this.cpuOverclockPercentage.value = '10';
        document.getElementById('cpuOverclockValue').textContent = '10';
        document.getElementById('cpuOverclockSliderContainer').style.display = 'none';
        this.gpuContainer.innerHTML = `
            <div class="form-group dropdown-container gpu-block" id="gpuDropdownContainer0">
                <div class="template__three-select-filters">
                    <div class="category">
                        <div class="category__title category--show">
                            <img src="${STATIC_URL}images/gpu2.png" />
                            <div class="title__text">GPU</div>
                        </div>
                    </div>
                    <div class="filter">
                        <input type="text" id="gpuInput0" placeholder="Enter GPU Model" />
                        <div class="dropdown-content" id="gpuDropdownContent0" style="display: none;">
                            <select size="10" id="gpuOptions0" class="gpu-options">
                                ${gpuOptionsHtml}
                            </select>
                        </div>
                        <div class="overclock-section">
                            <label>
                                <input type="checkbox" id="gpuOverclockCheckbox0"> Overclock
                            </label>
                            <div class="overclock-slider" id="gpuOverclockSliderContainer0" style="display: none;">
                                <label for="gpuOverclockPercentage0"> <span id="gpuOverclockValue0">10</span> % </label>
                                <input type="range" id="gpuOverclockPercentage0" min="0" max="25" value="10">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        this.gpuBlocks = [this.gpuContainer.querySelector('#gpuDropdownContainer0')];
        this.ramType.value = '';
        this.ramQuantity.value = '0';
        this.pciQuantities.forEach((input) => (input.value = '0'));
        this.storageQuantities.forEach((input) => (input.value = '0'));
        this.opticalDriveType.value = '';
        this.fanQuantity.value = '0';
    }

    filterOptions(input, options, dropdownContent) {
        const searchText = input.value.toLowerCase();
        let hasMatches = false;

        for (let i = 0; i < options.length; i++) {
            const optionText = options[i].text.toLowerCase();
            const matches = optionText.includes(searchText);
            options[i].style.display = matches ? '' : 'none';
            if (matches) hasMatches = true;
        }

        dropdownContent.style.display = (searchText || input === document.activeElement) && hasMatches ? 'block' : 'none';
    }
}

export default PSCalculatorView;