import { MenuItem, Select } from "@material-ui/core";

const monthOptions = [1, 2, 3, 6, 12, 24, 36, 60, 120, -1];
const getDurationText = (months: number) => {
    if (months === -1) {
        return "All time";
    }
    if (months / 12 < 1) {
        if (months === 1) {
            return "1 month";
        }
        return `${months} months`;
    }
    if (months === 12) {
        return "1 year";
    }
    return `${months / 12} years`;
};

interface MonthselectorProps {
    selectedMonths: number;
    onSelectedMonthsChange: (number) => void;
}

function MonthSelector({ selectedMonths, onSelectedMonthsChange }: MonthselectorProps) {
    return (
        <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedMonths}
            onChange={(event) => onSelectedMonthsChange(event.target.value)}
        >
            {monthOptions.map((month) => (
                <MenuItem value={month}>{getDurationText(month)}</MenuItem>
            ))}
        </Select>
    );
}
export default MonthSelector;
