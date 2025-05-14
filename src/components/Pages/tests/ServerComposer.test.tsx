import React from 'react';
import {render, screen, fireEvent} from '@testing-library/react';
import ServerComposer from '../ServerComposer';

// Mock the utility functions
jest.mock('../../utils/MemoryUtils', () => ({
    isValidMemory: jest.fn((value: string) => {
        const stripped = value.replace(/,/g, '');
        const num = parseInt(stripped, 10);
        const isPowerOfTwo = (n: number) => (n & (n - 1)) === 0;
        return (
            /^\d{1,3}(,\d{3})*$/.test(value) &&
            num >= 2048 &&
            num <= 8388608 &&
            num % 1024 === 0 &&
            isPowerOfTwo(num)
        );
    }),
    evaluateConfiguration: jest.fn(() => ['High Density Server'])
}));

describe('ServerComposer', () => {

    test('renders form elements correctly', () => {
        render(<ServerComposer/>)

        expect(screen.getByLabelText(/CPU/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Memory Size/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/GPU Accelerator Card/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /submit/i})).toBeInTheDocument();
    });

    test('displays error for invalid memory input', () => {
        render(<ServerComposer/>)

        fireEvent.change(screen.getByLabelText(/Memory Size/i), {target: {value: '3,072'}});
        fireEvent.click(screen.getByRole('button', {name: /submit/i}));

        expect(screen.getByText(/Memory must be a power of 2/i)).toBeInTheDocument();
    });

    test('does not submit when memory input is invalid', () => {
        render(<ServerComposer/>)

        fireEvent.change(screen.getByLabelText(/Memory Size/i), {target: {value: '3,072'}});
        fireEvent.click(screen.getByRole('button', {name: /submit/i}));

        expect(screen.queryByText(/High Density Server/i)).not.toBeInTheDocument();
    });

    test('GPU checkbox toggles correctly', () => {
        render(<ServerComposer/>)

        const gpuCheckbox = screen.getByLabelText(/GPU Accelerator Card/i) as HTMLInputElement;
        expect(gpuCheckbox.checked).toBe(false);

        fireEvent.click(gpuCheckbox);
        expect(gpuCheckbox.checked).toBe(true);
    });

    test('Submit button is disabled when memory input is invalid', () => {
        render(<ServerComposer/>)

        fireEvent.change(screen.getByLabelText(/Memory Size/i), {target: {value: '3,072'}});
        expect(screen.getByRole('button', {name: /submit/i})).toBeDisabled();
    });

});
