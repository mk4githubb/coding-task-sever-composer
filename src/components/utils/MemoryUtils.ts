import {CPUOption, ServerModel} from "../types/ServerConfigTypes";
import {isNumericCommaRegex} from "../Constants";

export const parseMemory = (value: string): number => parseInt(value.replace(/,/g, ''));

export const isNumericCommaFormat = (value: string): boolean => isNumericCommaRegex.test(value);

export const isValidMemory = (val: string): boolean => {
    // if any character other than number or , return early
    if (!isNumericCommaFormat(val)) {
        return false;
    }

    // Parse number and do further validations
    const num = parseMemory(val);
    return !isNaN(num) &&
        num % 1024 === 0 &&
        num >= 2048 &&
        num <= 8388608 &&
        (num & (num - 1)) === 0 // Taken from - https://www.designgurus.io/answers/detail/how-to-check-if-a-number-is-a-power-of-2
}

export const evaluateConfiguration = (cpu: CPUOption, memoryStr: string, gpu: boolean): ServerModel[] => {
    const memory = parseMemory(memoryStr);

    if (gpu) {
        return (cpu === 'ARM' && memory >= 524288) ? ['High Density Server'] : ['No Options'];
    }

    const options = new Set<ServerModel>();

    if (cpu === 'Power' && memory >= 2048) {
        options.add('Mainframe');
    }
    if (memory >= 131072) {
        options.add('Tower Server');
        options.add('4U Rack Server');
    } else if (memory >= 2048) {
        options.add('Tower Server');
    }

    return options.size > 0 ? Array.from(options) : ['No Options'];
};