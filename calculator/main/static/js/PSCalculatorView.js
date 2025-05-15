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
        console.log('Binding GPU events for index:', index);
        const gpuInput = document.getElementById(`gpuInput${index}`);
        const gpuOptions = document.getElementById(`gpuOptions${index}`);
        const gpuOverclockCheckbox = document.getElementById(`gpuOverclockCheckbox${index}`);
        const gpuOverclockPercentage = document.getElementById(`gpuOverclockPercentage${index}`);

        if (!gpuInput || !gpuOptions) {
            console.error(`GPU elements not found for index ${index}`);
            return;
        }

        gpuInput.addEventListener('focus', () => {
            console.log(`GPU input focused for index: ${index}`);
            handlers.onGpuInputFocus(index);
        });
        gpuInput.addEventListener('input', () => {
            console.log(`GPU input changed for index: ${index}`);
            handlers.onGpuInput(index);
        });
        gpuOptions.addEventListener('change', () => handlers.onGpuSelect(index));
        gpuOverclockCheckbox.addEventListener('change', () => handlers.onGpuOverclockChange(index));
        gpuOverclockPercentage.addEventListener('input', () => handlers.onGpuOverclockChange(index));
    }

    addGpuBlock(index, gpuOptionsHtml, staticUrl, onDeleteGpu) {
        console.log('Adding GPU block:', index);
        console.log('gpuOptionsHtml:', gpuOptionsHtml);
        const newGpuBlock = document.createElement('div');
        newGpuBlock.classList.add('form-group', 'dropdown-container', 'gpu-block');
        newGpuBlock.id = `gpuDropdownContainer${index}`;
        newGpuBlock.innerHTML = `
            <div class="template__three-select-filters">
                <div class="category">
                    <div class="category__title category--show">
                        <img src="${staticUrl}images/gpu2.png" />
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

        const deleteButton = document.getElementById(`delNewGpuOption${index}`).querySelector('button');
        deleteButton.addEventListener('click', () => {
            console.log('Delete button clicked for GPU:', index);
            this.deleteGpuBlock(index);
            onDeleteGpu(index);
        });
    }

    deleteGpuBlock(index) {
        console.log('Deleting GPU block:', index);
        if (this.gpuBlocks[index]) {
            this.gpuBlocks[index].remove();
            this.gpuBlocks[index] = null;
            // Очищаємо null-елементи та оновлюємо індекси
            this.gpuBlocks = this.gpuBlocks.filter(block => block !== null);
            // Переіндексуємо блоки
            this.gpuBlocks.forEach((block, i) => {
                if (block) {
                    block.id = `gpuDropdownContainer${i}`;
                    const input = block.querySelector('input[type="text"]');
                    const dropdown = block.querySelector('.dropdown-content');
                    const select = block.querySelector('select');
                    const checkbox = block.querySelector('input[type="checkbox"]');
                    const percentage = block.querySelector('input[type="range"]');
                    const value = block.querySelector('span[id*="gpuOverclockValue"]');
                    const sliderContainer = block.querySelector('.overclock-slider');
                    const delBtn = block.querySelector('.del__btn');
                    if (input) input.id = `gpuInput${i}`;
                    if (dropdown) dropdown.id = `gpuDropdownContent${i}`;
                    if (select) select.id = `gpuOptions${i}`;
                    if (checkbox) checkbox.id = `gpuOverclockCheckbox${i}`;
                    if (percentage) percentage.id = `gpuOverclockPercentage${i}`;
                    if (value) value.id = `gpuOverclockValue${i}`;
                    if (sliderContainer) sliderContainer.id = `gpuOverclockSliderContainer${i}`;
                    if (delBtn) {
                        delBtn.id = `delNewGpuOption${i}`;
                        // Переприв’язуємо обробник для кнопки видалення
                        const deleteButton = delBtn.querySelector('button');
                        // Видаляємо старі обробники
                        const newButton = deleteButton.cloneNode(true);
                        deleteButton.parentNode.replaceChild(newButton, deleteButton);
                        newButton.addEventListener('click', () => {
                            console.log('Delete button clicked for GPU:', i);
                            this.deleteGpuBlock(i);
                            // Викликаємо onDeleteGpu з контролера
                            window.dispatchEvent(new CustomEvent('deleteGpu', { detail: { index: i } }));
                        });
                    }
                    console.log(`Reindexed GPU block to index: ${i}`);
                }
            });
        }
    }

    updatePower(total, recommended) {
        console.log('Updating UI with:', { total, recommended });
        // Завжди відображаємо "+20%" у тексті
        this.totalPower.innerHTML = `
            The system consumes: <strong>${total || 0}W</strong><br>
            Recommended power supply(+20%): <strong>${recommended || 0}W</strong>
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
                            <img src="${staticUrl}images/gpu2.png" />
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

        dropdownContent.style.display = (searchText || input === document.activeElement) ? 'block' : 'none';
        console.log('Filtering options:', { searchText, hasMatches, display: dropdownContent.style.display });
    }
}

export default PSCalculatorView;