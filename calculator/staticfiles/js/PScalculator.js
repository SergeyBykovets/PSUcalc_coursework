document.addEventListener('DOMContentLoaded', function() {
    const cpuInput = document.getElementById('cpuInput');
    const cpuDropdownContent = document.getElementById('cpuDropdownContent');
    const cpuOptions = document.getElementById('cpuOptions');
    const gpuContainer = document.querySelector('.gpu-container');
    const addNewGpuButton = document.getElementById('addNewGpuOption');
    const ramType = document.getElementById('ramType');
    const ramQuantity = document.getElementById('ramQuantity');
    const pciQuantity1 = document.getElementById('pciQuantity1');
    const pciQuantity2 = document.getElementById('pciQuantity2');
    const pciQuantity3 = document.getElementById('pciQuantity3');
    const pciQuantity4 = document.getElementById('pciQuantity4');
    const storageQuantity1 = document.getElementById('storageQuantity1');
    const storageQuantity2 = document.getElementById('storageQuantity2');
    const storageQuantity3 = document.getElementById('storageQuantity3');
    const opticalDriveType = document.getElementById('opticalDriveType');
    const fanQuantity = document.getElementById('fanQuantity');
    const totalPower = document.getElementById('totalPower');

    // Змінні для зберігання обраних значень
    let selectedCpuPower = 0;
    let selectedGpuPowers = [0]; // Масив для зберігання потужностей усіх GPU
    let gpuCount = 0; // Лічильник для унікальних ID GPU

    // Функція для фільтрації опцій
    function filterOptions(input, options, dropdownContent) {
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

    // Функція для ініціалізації блоку CPU
    function initializeCpuBlock() {
        cpuInput.addEventListener('focus', function() {
            filterOptions(cpuInput, cpuOptions.options, cpuDropdownContent);
        });

        cpuInput.addEventListener('input', function() {
            filterOptions(cpuInput, cpuOptions.options, cpuDropdownContent);
        });

        cpuOptions.addEventListener('change', function() {
            if (this.value) {
                const selectedOption = this.options[this.selectedIndex];
                cpuInput.value = selectedOption.text;
                selectedCpuPower = parseInt(selectedOption.getAttribute('data-subtitle')) || 0;
                cpuDropdownContent.style.display = 'none';
                updatePower();
            }
        });

        document.addEventListener('click', function(event) {
            if (!cpuInput.contains(event.target) && !cpuDropdownContent.contains(event.target)) {
                cpuDropdownContent.style.display = 'none';
            }
        });
    }

    // Функція для ініціалізації блоку GPU
    function initializeGpuBlock(index) {
        const gpuInput = document.getElementById(`gpuInput${index}`);
        const gpuDropdownContent = document.getElementById(`gpuDropdownContent${index}`);
        const gpuOptions = document.getElementById(`gpuOptions${index}`);

        gpuInput.addEventListener('focus', function() {
            filterOptions(gpuInput, gpuOptions.options, gpuDropdownContent);
        });

        gpuInput.addEventListener('input', function() {
            filterOptions(gpuInput, gpuOptions.options, gpuDropdownContent);
        });

        gpuOptions.addEventListener('change', function() {
            if (this.value) {
                const selectedOption = this.options[this.selectedIndex];
                gpuInput.value = selectedOption.text;
                selectedGpuPowers[index] = parseInt(selectedOption.getAttribute('data-subtitle')) || 0;
                gpuDropdownContent.style.display = 'none';
                updatePower();
            }
        });

        document.addEventListener('click', function(event) {
            if (!gpuInput.contains(event.target) && !gpuDropdownContent.contains(event.target)) {
                gpuDropdownContent.style.display = 'none';
            }
        });
    }

    // Функція для ініціалізації розгону
    function initializeOverclock(index, type) {
        const checkbox = document.getElementById(`${type}OverclockCheckbox${index}`);
        const sliderContainer = document.getElementById(`${type}OverclockSliderContainer${index}`);
        const slider = document.getElementById(`${type}OverclockPercentage${index}`);
        const valueDisplay = document.getElementById(`${type}OverclockValue${index}`);


        checkbox.addEventListener('change', function() {
            if (this.checked) {
                sliderContainer.style.display = 'flex';
                sliderContainer.classList.add('active');
            } else {
                sliderContainer.style.display = 'none';
                sliderContainer.classList.remove('active');
            }
            updatePower();
        });

        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
            const value = parseInt(this.value);
            this.style.background = `linear-gradient(to right, #007bff ${value*4}%, #e0e0e0 ${value*4}%)`;
            updatePower();
        });

        // Ініціалізація при завантаженні
        if (checkbox.checked) {
            sliderContainer.style.display = 'flex';
            sliderContainer.classList.add('active');
            slider.style.background = `linear-gradient(to right, #007bff 10%, #e0e0e0 10%)`;
        } else {
            sliderContainer.style.display = 'none';
        }
    }

    // Ініціалізація CPU та першого блоку GPU
    initializeCpuBlock();
    initializeGpuBlock(0);
    initializeOverclock('', 'cpu'); // Ініціалізація розгону для CPU
    initializeOverclock(0, 'gpu'); // Ініціалізація розгону для першого GPU

    // Додавання нового блоку GPU
    addNewGpuButton.addEventListener('click', function() {
        gpuCount++;
        selectedGpuPowers.push(0);

        const newGpuBlock = document.createElement('div');
        newGpuBlock.classList.add('form-group', 'dropdown-container', 'gpu-block');
        newGpuBlock.id = `gpuDropdownContainer${gpuCount}`;
        newGpuBlock.innerHTML = `
            <div class="template__three-select-filters">
                <div class="category">
                    <div class="category__title category--show">
                        <img src="${STATIC_URL}images/gpu2.png" />
                        <div class="title__text">GPU</div>
                    </div>
                </div>
                <div class="filter">
                    <input type="text" id="gpuInput${gpuCount}" placeholder="Enter GPU Model" />
                    <div class="dropdown-content" id="gpuDropdownContent${gpuCount}" style="display: none;">
                       <select size="10" id="gpuOptions${gpuCount}" class="gpu-options">
                            ${gpuOptionsHtml}
                        </select>
                    </div>
                    <div class="overclock-section">
                        <label>
                            <input type="checkbox" id="gpuOverclockCheckbox${gpuCount}"> Overclock
                        </label>
                        <div class="overclock-slider" id="gpuOverclockSliderContainer${gpuCount}" style="display: none;">
                                <label for="gpuOverclockPercentage${gpuCount}"> <span id="gpuOverclockValue${gpuCount}">10</span> % </label>
                                <input type="range" id="gpuOverclockPercentage${gpuCount}" min="0" max="25" value="10">
                            </div>
                    </div>
                </div>
            </div>
            <div class="del__btn" id="delNewGpuOption${gpuCount}">
                <button><i class="fas fa-trash-alt"></i> Delete</button>
            </div>
        `;
        gpuContainer.appendChild(newGpuBlock);

        // Ініціалізація нового блоку GPU
        initializeGpuBlock(gpuCount);
        initializeOverclock(gpuCount, 'gpu'); // Ініціалізація розгону для нового GPU

        // Додавання обробника для кнопки видалення
        const delButton = document.getElementById(`delNewGpuOption${gpuCount}`).querySelector('button');
        delButton.addEventListener('click', function() {
            newGpuBlock.remove();
            selectedGpuPowers[gpuCount] = 0;
            updatePower();
        });
    });

    // Додаємо обробники подій для всіх інших компонентів
    ramType.addEventListener('change', updatePower);
    ramQuantity.addEventListener('input', updatePower);
    pciQuantity1.addEventListener('input', updatePower);
    pciQuantity2.addEventListener('input', updatePower);
    pciQuantity3.addEventListener('input', updatePower);
    pciQuantity4.addEventListener('input', updatePower);
    storageQuantity1.addEventListener('input', updatePower);
    storageQuantity2.addEventListener('input', updatePower);
    storageQuantity3.addEventListener('input', updatePower);
    opticalDriveType.addEventListener('change', updatePower);
    fanQuantity.addEventListener('input', updatePower);

    // Оновлення потужності
    function updatePower() {
        let total = selectedCpuPower || 0;

        // Розгін CPU
        const cpuOverclockCheckbox = document.getElementById('cpuOverclockCheckbox');
        const cpuOverclockPercentage = document.getElementById('cpuOverclockPercentage');
        if (cpuOverclockCheckbox && cpuOverclockPercentage && cpuOverclockCheckbox.checked) {
            const overclockFactor = 1 + (parseInt(cpuOverclockPercentage.value) || 0) / 100;
            total += selectedCpuPower * (overclockFactor - 1);
        }

        // GPU
        const totalGpuPower = selectedGpuPowers.reduce((sum, power, index) => {
            const gpuInput = document.getElementById(`gpuInput${index}`);
            let gpuPower = gpuInput && gpuInput.value ? power || 0 : 0;

            const gpuOverclockCheckbox = document.getElementById(`gpuOverclockCheckbox${index}`);
            const gpuOverclockPercentage = document.getElementById(`gpuOverclockPercentage${index}`);
            if (gpuOverclockCheckbox && gpuOverclockPercentage && gpuOverclockCheckbox.checked) {
                const overclockFactor = 1 + (parseInt(gpuOverclockPercentage.value) || 0) / 100;
                gpuPower *= overclockFactor;
            }

            return sum + gpuPower;
        }, 0);
        total += totalGpuPower;

        // RAM
        const ramPowerPerModule = parseInt(ramType.selectedOptions[0]?.getAttribute('data-subtitle') || 0) || 0;
        const ramCount = Math.max(0, parseInt(ramQuantity.value) || 0);
        total += ramPowerPerModule * ramCount;

        // PCI-e
        const pciPower1 = Math.max(0, parseInt(pciQuantity1.value) || 0) * 5;
        const pciPower2 = Math.max(0, parseInt(pciQuantity2.value) || 0) * 10;
        const pciPower3 = Math.max(0, parseInt(pciQuantity3.value) || 0) * 15;
        const pciPower4 = Math.max(0, parseInt(pciQuantity4.value) || 0) * 25;
        total += pciPower1 + pciPower2 + pciPower3 + pciPower4;

        // Storage
        const storagePower1 = Math.max(0, parseInt(storageQuantity1.value) || 0) * 15;
        const storagePower2 = Math.max(0, parseInt(storageQuantity2.value) || 0) * 5;
        const storagePower3 = Math.max(0, parseInt(storageQuantity3.value) || 0) * 8;
        total += storagePower1 + storagePower2 + storagePower3;

        // Optical
        const opticalPower = parseInt(opticalDriveType.selectedOptions[0]?.getAttribute('data-subtitle') || 0) || 0;
        total += opticalPower;

        // Fans
        const fanPower = Math.max(0, parseInt(fanQuantity.value) || 0) * 5;
        total += fanPower;

        const recommended = Math.ceil(total * 1.20); // +20% запас

        totalPower.innerHTML = `
            The system consumes: <strong>${Math.round(total)}W</strong><br>
            Recommended power supply: <strong>${recommended}W</strong>
        `;
    }

    // Кнопка скидання
    document.getElementById('resetButton').addEventListener('click', function() {
        // Скидання CPU
        cpuInput.value = '';
        cpuOptions.value = '';
        cpuDropdownContent.style.display = 'none';
        selectedCpuPower = 0;
        document.getElementById('cpuOverclockCheckbox').checked = false;
        document.getElementById('cpuOverclockSliderContainer').style.display = 'none';
        document.getElementById('cpuOverclockPercentage').value = 10;
        document.getElementById('cpuOverclockValue').textContent = 10;

        // Скидання всіх GPU
        gpuContainer.innerHTML = `
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
                        <div class="dropdown-content" id="gpuDropdownContent${gpuCount}" style="display: none;">
                            <select size="10" id="gpuOptions${gpuCount}" class="gpu-options">
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
        selectedGpuPowers = [0];
        gpuCount = 0;
        initializeGpuBlock(0);
        initializeOverclock(0, 'gpu');

        // Скидання інших полів
        ramType.value = '';
        ramQuantity.value = '0';
        pciQuantity1.value = '0';
        pciQuantity2.value = '0';
        pciQuantity3.value = '0';
        pciQuantity4.value = '0';
        storageQuantity1.value = '0';
        storageQuantity2.value = '0';
        storageQuantity3.value = '0';
        opticalDriveType.value = '';
        fanQuantity.value = '0';

        // Скидання всіх опцій CPU
        const cpuOptionsList = cpuOptions.options;
        for (let i = 0; i < cpuOptionsList.length; i++) {
            cpuOptionsList[i].style.display = '';
        }

        // Оновлення потужності
        updatePower();
    });
});