class PSCalculatorController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.gpuCount = 0;

        this.view.bindEvents({
            onCpuInputFocus: this.onCpuInputFocus.bind(this),
            onCpuInput: this.onCpuInput.bind(this),
            onCpuSelect: this.onCpuSelect.bind(this),
            onCpuOverclockChange: this.onCpuOverclockChange.bind(this),
            onDocumentClick: this.onDocumentClick.bind(this),
            onAddGpu: this.onAddGpu.bind(this),
            onGpuInputFocus: this.onGpuInputFocus.bind(this),
            onGpuInput: this.onGpuInput.bind(this),
            onGpuSelect: this.onGpuSelect.bind(this),
            onGpuOverclockChange: this.onGpuOverclockChange.bind(this),
            onDeleteGpu: this.onDeleteGpu.bind(this),
            onRamChange: this.onRamChange.bind(this),
            onPciChange: this.onPciChange.bind(this),
            onStorageChange: this.onStorageChange.bind(this),
            onOpticalDriveChange: this.onOpticalDriveChange.bind(this),
            onFansChange: this.onFansChange.bind(this),
            onReset: this.onReset.bind(this),
        });

        // Слухаємо подію deleteGpu для оновлення моделі
        window.addEventListener('deleteGpu', (event) => {
            const { index } = event.detail;
            console.log('Received deleteGpu event for index:', index);
            this.onDeleteGpu(index);
        });
    }

    onCpuInputFocus() {
        this.view.filterOptions(this.view.cpuInput, this.view.cpuOptions.options, this.view.cpuDropdownContent);
    }

    onCpuInput() {
        this.view.filterOptions(this.view.cpuInput, this.view.cpuOptions.options, this.view.cpuDropdownContent);
    }

    onCpuSelect() {
        const selectedOption = this.view.cpuOptions.options[this.view.cpuOptions.selectedIndex];
        if (selectedOption.value) {
            this.view.cpuInput.value = selectedOption.text;
            this.model.setCpu(parseInt(selectedOption.getAttribute('data-subtitle')) || 0, selectedOption.text);
            this.view.cpuDropdownContent.style.display = 'none';
            this.updatePower();
        }
    }

    onCpuOverclockChange() {
        const checkbox = this.view.cpuOverclockCheckbox;
        const slider = this.view.cpuOverclockPercentage;
        const valueDisplay = document.getElementById('cpuOverclockValue');
        const sliderContainer = document.getElementById('cpuOverclockSliderContainer');

        console.log('CPU overclock changed:', { checked: checkbox.checked, value: slider.value });

        if (checkbox.checked) {
            sliderContainer.style.display = 'flex';
            sliderContainer.classList.add('active');
        } else {
            sliderContainer.style.display = 'none';
            sliderContainer.classList.remove('active');
        }

        valueDisplay.textContent = slider.value;
        slider.style.background = `linear-gradient(to right, #007bff ${slider.value * 4}%, #e0e0e0 ${slider.value * 4}%)`;

        this.model.setCpuOverclock(checkbox.checked, parseInt(slider.value));
        this.updatePower();
    }

    onDocumentClick(event) {
        if (!this.view.cpuInput.contains(event.target) && !this.view.cpuDropdownContent.contains(event.target)) {
            this.view.cpuDropdownContent.style.display = 'none';
        }

        const gpuBlocks = document.querySelectorAll('.gpu-block');
        gpuBlocks.forEach((block, index) => {
            const gpuInput = document.getElementById(`gpuInput${index}`);
            const gpuDropdownContent = document.getElementById(`gpuDropdownContent${index}`);
            if (gpuInput && gpuDropdownContent && !gpuInput.contains(event.target) && !gpuDropdownContent.contains(event.target)) {
                console.log('Closing dropdown for GPU:', index);
                gpuDropdownContent.style.display = 'none';
            }
        });
    }

    onAddGpu() {
        this.gpuCount++;
        console.log('Adding new GPU, current count:', this.gpuCount);
        this.view.addGpuBlock(this.gpuCount, window.gpuOptionsHtml, window.STATIC_URL, this.onDeleteGpu.bind(this));
        this.view.bindGpuEvents(this.gpuCount, {
            onGpuInputFocus: this.onGpuInputFocus.bind(this),
            onGpuInput: this.onGpuInput.bind(this),
            onGpuSelect: this.onGpuSelect.bind(this),
            onGpuOverclockChange: this.onGpuOverclockChange.bind(this),
            onDeleteGpu: this.onDeleteGpu.bind(this),
        });
        this.model.addGpu(0, '');
        this.updatePower();
    }

    onGpuInputFocus(index) {
        const gpuInput = document.getElementById(`gpuInput${index}`);
        const gpuOptions = document.getElementById(`gpuOptions${index}`);
        const gpuDropdownContent = document.getElementById(`gpuDropdownContent${index}`);
        this.view.filterOptions(gpuInput, gpuOptions.options, gpuDropdownContent);
    }

    onGpuInput(index) {
        const gpuInput = document.getElementById(`gpuInput${index}`);
        const gpuOptions = document.getElementById(`gpuOptions${index}`);
        const gpuDropdownContent = document.getElementById(`gpuDropdownContent${index}`);
        this.view.filterOptions(gpuInput, gpuOptions.options, gpuDropdownContent);
    }

    onGpuSelect(index) {
        const gpuOptions = document.getElementById(`gpuOptions${index}`);
        const selectedOption = gpuOptions.options[gpuOptions.selectedIndex];
        if (selectedOption.value) {
            const gpuInput = document.getElementById(`gpuInput${index}`);
            gpuInput.value = selectedOption.text;
            this.model.setGpu(index, parseInt(selectedOption.getAttribute('data-subtitle')) || 0, selectedOption.text);
            document.getElementById(`gpuDropdownContent${index}`).style.display = 'none';
            this.updatePower();
        }
    }

    onGpuOverclockChange(index) {
        const checkbox = document.getElementById(`gpuOverclockCheckbox${index}`);
        const slider = document.getElementById(`gpuOverclockPercentage${index}`);
        const valueDisplay = document.getElementById(`gpuOverclockValue${index}`);
        const sliderContainer = document.getElementById(`gpuOverclockSliderContainer${index}`);

        if (checkbox.checked) {
            sliderContainer.style.display = 'flex';
            sliderContainer.classList.add('active');
        } else {
            sliderContainer.style.display = 'none';
            sliderContainer.classList.remove('active');
        }

        valueDisplay.textContent = slider.value;
        slider.style.background = `linear-gradient(to right, #007bff ${slider.value * 4}%, #e0e0e0 ${slider.value * 4}%)`;

        this.model.setGpuOverclock(index, checkbox.checked, parseInt(slider.value));
        this.updatePower();
    }

    onDeleteGpu(index) {
        console.log('Processing delete GPU:', index);
        this.model.removeGpu(index);
        this.gpuCount = this.view.gpuBlocks.length;
        // Переприв’язуємо обробники для всіх блоків
        this.view.gpuBlocks.forEach((block, i) => {
            if (block) {
                this.view.bindGpuEvents(i, {
                    onGpuInputFocus: this.onGpuInputFocus.bind(this),
                    onGpuInput: this.onGpuInput.bind(this),
                    onGpuSelect: this.onGpuSelect.bind(this),
                    onGpuOverclockChange: this.onGpuOverclockChange.bind(this),
                    onDeleteGpu: this.onDeleteGpu.bind(this),
                });
            }
        });
        this.updatePower();
    }

    onRamChange() {
        const powerPerModule = parseInt(this.view.ramType.selectedOptions[0]?.getAttribute('data-subtitle') || 0);
        this.model.setRam(this.view.ramType.value, parseInt(this.view.ramQuantity.value) || 0, powerPerModule);
        this.updatePower();
    }

    onPciChange() {
        this.model.setPci(
            parseInt(this.view.pciQuantities[0].value) || 0,
            parseInt(this.view.pciQuantities[1].value) || 0,
            parseInt(this.view.pciQuantities[2].value) || 0,
            parseInt(this.view.pciQuantities[3].value) || 0
        );
        this.updatePower();
    }

    onStorageChange() {
        this.model.setStorage(
            parseInt(this.view.storageQuantities[0].value) || 0,
            parseInt(this.view.storageQuantities[1].value) || 0,
            parseInt(this.view.storageQuantities[2].value) || 0
        );
        this.updatePower();
    }

    onOpticalDriveChange() {
        const power = parseInt(this.view.opticalDriveType.selectedOptions[0]?.getAttribute('data-subtitle') || 0);
        this.model.setOpticalDrive(this.view.opticalDriveType.value, power);
        this.updatePower();
    }

    onFansChange() {
        this.model.setFans(parseInt(this.view.fanQuantity.value) || 0);
        this.updatePower();
    }

    onReset() {
        this.model.reset();
        this.view.reset(window.STATIC_URL, window.gpuOptionsHtml);
        this.gpuCount = 0;
        this.view.bindGpuEvents(0, {
            onGpuInputFocus: this.onGpuInputFocus.bind(this),
            onGpuInput: this.onGpuInput.bind(this),
            onGpuSelect: this.onGpuSelect.bind(this),
            onGpuOverclockChange: this.onGpuOverclockChange.bind(this),
            onDeleteGpu: this.onDeleteGpu.bind(this),
        });
        this.updatePower();
    }

    updatePower() {
        const { total, recommended } = this.model.calculatePower();
        this.view.updatePower(total, recommended);
    }
}

export default PSCalculatorController;