class PSCalculatorModel {
    constructor() {
        this.cpu = { power: 0, overclock: false, overclockPercentage: 10, model: '' };
        this.gpus = [{ power: 0, overclock: false, overclockPercentage: 10, model: '' }];
        this.ram = { type: '', quantity: 0, powerPerModule: 0 };
        this.pci = { x1: 0, x4: 0, x8: 0, x16: 0 };
        this.storage = { hdd: 0, sataSsd: 0, m2Ssd: 0 };
        this.opticalDrive = { type: '', power: 0 };
        this.fans = { quantity: 0 };
    }

    setCpu(power, model) {
        this.cpu.power = power;
        this.cpu.model = model;
    }

    setCpuOverclock(isOverclocked, percentage) {
        console.log('Setting CPU overclock:', { isOverclocked, percentage });
        this.cpu.overclock = isOverclocked;
        this.cpu.overclockPercentage = percentage;
    }

    addGpu(power, model) {
        this.gpus.push({ power, model, overclock: false, overclockPercentage: 10 });
    }

    setGpu(index, power, model) {
        this.gpus[index] = { power, model, overclock: this.gpus[index]?.overclock || false, overclockPercentage: this.gpus[index]?.overclockPercentage || 10 };
    }

    setGpuOverclock(index, isOverclocked, percentage) {
        this.gpus[index].overclock = isOverclocked;
        this.gpus[index].overclockPercentage = percentage;
    }

    removeGpu(index) {
        this.gpus.splice(index, 1);
    }

    setRam(type, quantity, powerPerModule) {
        this.ram.type = type;
        this.ram.quantity = quantity;
        this.ram.powerPerModule = powerPerModule;
    }

    setPci(x1, x4, x8, x16) {
        this.pci.x1 = x1;
        this.pci.x4 = x4;
        this.pci.x8 = x8;
        this.pci.x16 = x16;
    }

    setStorage(hdd, sataSsd, m2Ssd) {
        this.storage.hdd = hdd;
        this.storage.sataSsd = sataSsd;
        this.storage.m2Ssd = m2Ssd;
    }

    setOpticalDrive(type, power) {
        this.opticalDrive.type = type;
        this.opticalDrive.power = power;
    }

    setFans(quantity) {
        this.fans.quantity = quantity;
    }

    calculatePower() {
        let total = 0;

        let cpuPower = this.cpu.power || 0;
        if (this.cpu.overclock) {
            const overclockFactor = 1 + (this.cpu.overclockPercentage / 100);
            cpuPower *= overclockFactor;
        }
        total += cpuPower;

        total += this.gpus.reduce((sum, gpu) => {
            let gpuPower = gpu.power || 0;
            if (gpu.overclock) {
                const overclockFactor = 1 + (gpu.overclockPercentage / 100);
                gpuPower *= overclockFactor;
            }
            return sum + gpuPower;
        }, 0);

        total += (this.ram.powerPerModule || 0) * (this.ram.quantity || 0);

        total += (this.pci.x1 || 0) * 5 + (this.pci.x4 || 0) * 10 + (this.pci.x8 || 0) * 15 + (this.pci.x16 || 0) * 25;

        total += (this.storage.hdd || 0) * 15 + (this.storage.sataSsd || 0) * 5 + (this.storage.m2Ssd || 0) * 8;

        total += this.opticalDrive.power || 0;

        total += (this.fans.quantity || 0) * 5;

        const recommended = Math.ceil(total * 1.2);
        return { total: Math.round(total), recommended };
    }

    reset() {
        this.cpu = { power: 0, overclock: false, overclockPercentage: 10, model: '' };
        this.gpus = [{ power: 0, overclock: false, overclockPercentage: 10, model: '' }];
        this.ram = { type: '', quantity: 0, powerPerModule: 0 };
        this.pci = { x1: 0, x4: 0, x8: 0, x16: 0 };
        this.storage = { hdd: 0, sataSsd: 0, m2Ssd: 0 };
        this.opticalDrive = { type: '', power: 0 };
        this.fans = { quantity: 0 };
    }
}

export default PSCalculatorModel;