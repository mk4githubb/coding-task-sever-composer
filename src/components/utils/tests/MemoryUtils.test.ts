import {parseMemory, isNumericCommaFormat, isValidMemory, evaluateConfiguration} from '../MemoryUtils';
import {CPUOption} from "../../types/ServerConfigTypes";

describe('parseMemory', () => {
    test.each([
        ['262,144', 262144],
        ['1,048,576', 1048576],
        ['2048', 2048],
        ['8,388,608', 8388608],
    ])('parseMemory("%s") should return %d', (input, expected) => {
        expect(parseMemory(input)).toBe(expected);
    });
});

describe('isNumericCommaFormat', () => {
    test.each([
        ['262,144', true],
        ['1,024MB', false],
        ['1024', true],
        ['10.24', false],
        ['abc', false],
        ['123,456abc', false],
        ['', false],
    ])('isNumericCommaFormat("%s") should return %s', (input, expected) => {
        expect(isNumericCommaFormat(input)).toBe(expected);
    });
});

describe('isValidMemory', () => {
    test.each([
        ['1024', false], // below minimum
        ['2048', true],  // exact minimum
        ['3,072', false], // not power of 2
        ['4,096', true],  // valid
        ['8,388,608', true], // upper bound
        ['8,388,609', false], // above upper bound
        ['abc', false],
        ['524,288abc', false],
    ])('isValidMemory("%s") should return %s', (input, expected) => {
        expect(isValidMemory(input)).toBe(expected);
    });
});

describe('evaluateConfiguration', () => {
    test.each([
        // GPU true
        ['ARM', '524,288', true, ['High Density Server']],
        ['ARM', '262,144', true, ['No Options']],
        ['X86', '524,288', true, ['No Options']],
        ['Power', '524,288', true, ['No Options']],

        // Power CPU with valid memory and no GPU
        ['Power', '262,144', false, ['Mainframe', 'Tower Server', '4U Rack Server']],
        ['Power', '2,048', false, ['Mainframe', 'Tower Server']],
        ['Power', '1,024', false, ['No Options']],

        // X86 CPU with large memory
        ['X86', '524,288', false, ['Tower Server', '4U Rack Server']],
        ['X86', '65,536', false, ['Tower Server']],
        ['X86', '1,024', false, ['No Options']],

        // ARM CPU with no GPU
        ['ARM', '131,072', false, ['Tower Server', '4U Rack Server']],
        ['ARM', '65,536', false, ['Tower Server']],
        ['ARM', '1,024', false, ['No Options']],

        // Edge: maximum memory
        ['Power', '8,388,608', false, ['Mainframe', 'Tower Server', '4U Rack Server']],
    ])('evaluateConfiguration(%s, "%s", %s) should return %j', (cpu, memory, gpu, expected) => {
        expect(evaluateConfiguration(cpu as CPUOption, memory, gpu)).toEqual(expected);
    });
});
