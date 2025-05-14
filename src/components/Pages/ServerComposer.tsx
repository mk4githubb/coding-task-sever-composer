import React, {useState, ChangeEvent} from 'react';
import {
    Container,
    Typography,
    TextField,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Button,
    Divider,
    List,
    ListItem
} from '@mui/material';
import {cpuOptions} from "../Constants";
import {CPUOption, ServerModel} from '../types/ServerConfigTypes';
import {evaluateConfiguration, isValidMemory} from "../utils/MemoryUtils";

export default function ServerComposer() {
    const [cpu, setCpu] = useState<CPUOption>('Power');
    const [memory, setMemory] = useState<string>('2,048');
    const [gpu, setGpu] = useState<boolean>(false);
    const [results, setResults] = useState<ServerModel[]>([]);
    const [memoryError, setMemoryError] = useState<boolean>(false);

    const handleSubmit = (): void => {
        if (memoryError || !isValidMemory(memory)) {
            // Memory error
            return
        }
        setResults(evaluateConfiguration(cpu, memory, gpu));
    };

    const validateAndSetMemory = (e: ChangeEvent<HTMLInputElement>) => {
        setMemory(e.target.value);

        // Update memory and error state
        const isValid = isValidMemory(e.target.value);

        if (isValid) {
            setMemoryError(false);
        } else {
            setMemoryError(true);
        }
    }

    const renderTextBox = () => (
        <Checkbox
            checked={gpu}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setGpu(e.target.checked)}
        />
    )

    return (
        <Container maxWidth="sm" sx={{mt: 4}}>
            <Typography variant="h4" gutterBottom>Server Composer</Typography>

            <TextField
                select
                label="CPU"
                value={cpu}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCpu(e.target.value as CPUOption)}
                fullWidth
                margin="normal"
            >
                {cpuOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                label="Memory Size (MB)"
                value={memory}
                onChange={validateAndSetMemory}
                fullWidth
                margin="normal"
                error={memoryError}
                helperText={memoryError ? 'Memory must be a power of 2, multiple of 1024, and between 2048 and 8388608 MB.' : ''}
            />

            <FormControlLabel
                control={renderTextBox()}
                label="GPU Accelerator Card"
            />

            <Button variant="contained" color="primary" onClick={handleSubmit} sx={{mt: 2}} disabled={memoryError}>
                Submit
            </Button>

            <Divider sx={{my: 4}}/>

            <Typography variant="h6">Server Model Options</Typography>
            <List>
                {results?.map((option, index) => (
                    <ListItem key={index}>{option}</ListItem>
                ))}
            </List>
        </Container>
    );
}
