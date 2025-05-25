import PSCalculatorModel from '../../static/js/PSCalculatorModel'

describe('PSCalculatorModel', () => {
    let model;

    beforeEach(() => {
        model = new PSCalculatorModel();
    });

    test('should set CPU correctly', () => {
        model.setCpu(65, 'Intel i3 10300f');
        expect(model.cpu).toEqual({power: 65, model: 'Intel i3 10300f',
        overclock: false, overclockPercentage: 10});
    });

    test('should apply CPU overclocking in power calculation', () => {
        model.setCpu(100, 'cpu for Test');
        model.setCpuOverclock(true, 15);
        const power = model.calculatePower();
        expect(power.total).toBeCloseTo(115);
    });

    test('should add and remove GPU correctly', () => {
        model.addGpu(350, 'RTX 3090');
        expect(model.gpus.length).toBe(2);
        model.removeGpu(1);
        expect(model.gpus.length).toBe(1);
    });

    test('should calculate GPU overclocked power', () => {
        model.setGpu(0, 350, 'RT 7900 XTX');
        model.setGpuOverclock(0, true, 14); // 14% of 350 is 49 ==> total 399
        const power = model.calculatePower();
        expect(power.total).toBeCloseTo(399); // 350 default + 49 overclock => 399
    });

    test('should calculate RAM power correctly', () => {
        model.setRam('DDR4', 4, 7);
        const power = model.calculatePower();
        expect(power.total).toBe(28); // 4 modules, 7 watts each => 7*4 = 28
    });

    test('should calculate PCI power correctly', () => {
        model.setPci(1, 1, 1, 1);
        const power = model.calculatePower();
        expect(power.total).toBe(55);
    });

    test('should calculate storage power correctly', () => {
        model.setStorage(1, 2, 3);
        const power = model.calculatePower();
        expect(power.total).toBe(49); // 1 hdd with 15 W; 2 2.5 ssd with 5 W; 3 m2 ssd with 8 W;
        // 1*15 + 2*5 + 3*8 = 49
    });

    test('should calculate optical drive power', () => {
        model.setOpticalDrive('DVD', 25);
        const power = model.calculatePower();
        expect(power.total).toBe(25);
    });

    test('should calculate power of fans', () => {
        model.setFans(4);
        const power = model.calculatePower();
        expect(power.total).toBe(20);
    });

    test('should reset model to defaults', () => {
        model.setCpu(159, 'cpu for test');
        model.setGpu(1, 390, 'RTX 2090');
        model.setGpuOverclock(1, true, 15);
        model.setFans(4);
        model.setRam('DDR5', 2, 10);
        model.reset();
        expect(model.cpu.power).toBe(0);
        expect(model.ram.quantity).toBe(0);
        expect(model.fans.quantity).toBe(0);
        expect(model.gpus.length).toBe(1);
        expect(model.gpus[0].overclockPercentage).toBe(10);

    });

});