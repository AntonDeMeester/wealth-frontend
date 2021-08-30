import moment from "moment";
import { WealthItem } from "src/types/banking";

class DataService {
    public sumByDay(balances: WealthItem[]): WealthItem[] {
        const initial: { [date: string]: WealthItem } = {};
        const defaultItem: WealthItem = {
            date: "",
            amount: 0,
            amountInEuro: 0,
        };
        const dateMap: { [date: string]: WealthItem } = balances.reduce((reduced, current) => {
            const amountAtDate: WealthItem = reduced[current.date] || { ...defaultItem, date: current.date };
            amountAtDate.amount += current.amount;
            amountAtDate.amountInEuro += current.amountInEuro;
            reduced[amountAtDate.date] = amountAtDate;
            return reduced;
        }, initial);
        return Object.values(dateMap);
    }

    public getMonthsOfWealthItems(balances: WealthItem[]): moment.Moment[] {
        const dates = balances.map((b) => moment(b.date));
        let startDate = moment.min(dates).add(1, "month").startOf("month");
        const endDate = moment.max(dates).startOf("month");
        let out = [startDate];
        while (startDate.isBefore(endDate)) {
            startDate = startDate.add(1, "month");
            out.push(startDate);
        }
        return out;
    }

    public getItemsOfLastXMonths(balances: WealthItem[], numberOfMonths: number = 1): WealthItem[] {
        if (!balances.length) {
            return [];
        }
        const lastMonth = moment().subtract(numberOfMonths, "month");
        let balancesLastMonth = balances.filter((b) => moment(b.date).isAfter(lastMonth));
        if (balancesLastMonth.length === 0) {
            const lastDay = moment.max(balances.map((b) => moment(b.date)));
            balancesLastMonth = balancesLastMonth.concat(
                balances
                    .filter((b) => moment(b.date).isSame(lastDay, "day"))
                    .map((b) => ({ ...b, date: lastDay.toString() }))
            );
        }
        return balancesLastMonth;
    }

    public addEmptyDates(inputItems: WealthItem[], allDates: string[]): WealthItem[] {
        const presentDates = inputItems.map((b) => b.date);
        const newBalances: WealthItem[] = [];
        for (let newDate of allDates) {
            if (!presentDates.includes(newDate)) {
                newBalances.push({
                    date: newDate,
                    amount: 0,
                    amountInEuro: 0,
                });
            }
        }
        return inputItems.concat(newBalances);
    }

    public reduceLength<T>(inputArray: T[], amount: number): T[] {
        if (inputArray.length <= amount) {
            return inputArray;
        }
        const sequence = Array.from(Array(amount).keys());
        return sequence.map((i) => inputArray[Math.floor(((i + 1) * inputArray.length) / amount - 1)]);
    }
}

export const dataService = new DataService();
export default dataService;
