/**
 * Controller class.
 * Connects the View and Model, handles UI elements and updates state and view accordingly.
 */
class PSCalculatorController {
    /**
     * Constructor
     * Initializes the controller with the given model and view,
     * binds UI events to handler methods.
     *
     * @param {Object} model - Instance of PSCalculatorModel.
     * @param {Object} view - Instance of PSCalculatorView.
     */
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

       
        window.addEventListener('deleteGpu', (event) => {
            const { index } = event.detail;
            console.log('Received deleteGpu event for index:', index);
            this.onDeleteGpu(index);
        });
    }

    /** Handles focus event on CPU input filtering dropdown options. */
    onCpuInputFocus() {
        this.view.filterOptions(this.view.cpuInput, this.view.cpuOptions.options, this.view.cpuDropdownContent);
    }

    /** Handles input event on CPU field to filter matching dropdown options. */
    onCpuInput() {
        this.view.filterOptions(this.view.cpuInput, this.view.cpuOptions.options, this.view.cpuDropdownContent);
    }

    /** Handles CPU selection from dropdown and updates model. */
    onCpuSelect() {
        const selectedOption = this.view.cpuOptions.options[this.view.cpuOptions.selectedIndex];
        if (selectedOption.value) {
            this.view.cpuInput.value = selectedOption.text;
            this.model.setCpu(parseInt(selectedOption.getAttribute('data-subtitle')) || 0, selectedOption.text);
            this.view.cpuDropdownContent.style.display = 'none';
            this.updatePower();
        }
    }

    /** Handles toggling of CPU overclock and updates model + slider UI. */
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

    /**
     * Hides CPU and GPU dropdowns when clicking outside them.
     *
     * @param {MouseEvent} event
     */
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

    /** Adds a new GPU block to the view and model, and binds its events. */
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

    /**
     * Filters GPU options by input (focus or typing).
     *
     * @param {number} index - Index of the GPU block.
     */
    onGpuInputFocus(index) {
        const gpuInput = document.getElementById(`gpuInput${index}`);
        const gpuOptions = document.getElementById(`gpuOptions${index}`);
        const gpuDropdownContent = document.getElementById(`gpuDropdownContent${index}`);
        this.view.filterOptions(gpuInput, gpuOptions.options, gpuDropdownContent);
    }

    /**
     * Filters GPU options when user types.
     *
     * @param {number} index
     */
    onGpuInput(index) {
        const gpuInput = document.getElementById(`gpuInput${index}`);
        const gpuOptions = document.getElementById(`gpuOptions${index}`);
        const gpuDropdownContent = document.getElementById(`gpuDropdownContent${index}`);
        this.view.filterOptions(gpuInput, gpuOptions.options, gpuDropdownContent);
    }

    /**
     * Selects a GPU from dropdown, updates model and UI.
     *
     * @param {number} index
     */
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

    /**
     * Handles GPU overclock toggle and slider value update.
     *
     * @param {number} index
     */
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

    /**
     * Removes GPU block and updates model and power calculations.
     *
     * @param {number} index
     */
    onDeleteGpu(index) {
        console.log('Processing delete GPU:', index);
        this.model.removeGpu(index);
        this.gpuCount = this.view.gpuBlocks.length;
        // Rebinding handlers for all blocks
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

    /** Handles changes in RAM configuration. */
    onRamChange() {
        const powerPerModule = parseInt(this.view.ramType.selectedOptions[0]?.getAttribute('data-subtitle') || 0);
        this.model.setRam(this.view.ramType.value, parseInt(this.view.ramQuantity.value) || 0, powerPerModule);
        this.updatePower();
    }

    /** Updates model when PCI slot counts change. */
    onPciChange() {
        this.model.setPci(
            parseInt(this.view.pciQuantities[0].value) || 0,
            parseInt(this.view.pciQuantities[1].value) || 0,
            parseInt(this.view.pciQuantities[2].value) || 0,
            parseInt(this.view.pciQuantities[3].value) || 0
        );
        this.updatePower();
    }

    /** Updates model when storage device counts change. */
    onStorageChange() {
        this.model.setStorage(
            parseInt(this.view.storageQuantities[0].value) || 0,
            parseInt(this.view.storageQuantities[1].value) || 0,
            parseInt(this.view.storageQuantities[2].value) || 0
        );
        this.updatePower();
    }

    /** Updates model when optical drive is changed. */
    onOpticalDriveChange() {
        const power = parseInt(this.view.opticalDriveType.selectedOptions[0]?.getAttribute('data-subtitle') || 0);
        this.model.setOpticalDrive(this.view.opticalDriveType.value, power);
        this.updatePower();
    }

     /** Updates model when fan quantity is changed. */
    onFansChange() {
        this.model.setFans(parseInt(this.view.fanQuantity.value) || 0);
        this.updatePower();
    }

    /** Resets both model and view to initial state. */
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

    /** Recalculates power consumption and updates view display. */
    updatePower() {
        const { total, recommended } = this.model.calculatePower();
        this.view.updatePower(total, recommended);
    }
}

export default PSCalculatorController;
