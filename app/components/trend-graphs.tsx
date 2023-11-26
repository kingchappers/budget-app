"use client"

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryGroup } from 'victory';
import { getLastTwelveMonths } from '../lib/utils';
import { twelveMonthsInOrder } from './trend-calculations';

interface spendTrendProps {
    monthlySpendData: monthSpendData[],
}

export interface monthSpendData {
    month: string,
    monthSpend: number,
}

interface incomeTrendProps {
    monthlyIncomeData: monthIncomeData[],
}

export interface monthIncomeData {
    month: string,
    monthIncome: number,
}

interface groupChartProps {
    monthSpendData: monthSpendData[],
    monthIncomeData: monthIncomeData[]
}

export function YearlySpendBarTrend({ monthlySpendData }: spendTrendProps) {
    const months = twelveMonthsInOrder()

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <VictoryChart domainPadding={20} theme={VictoryTheme.material} style={{ parent: { maxWidth: "50%" } }} width={550}>
                <VictoryAxis label="Month" style={{ tickLabels: { padding: 5, fontSize: 8 }, axisLabel: { padding: 25, fontSize: 9 } }} />
                <VictoryAxis dependentAxis tickFormat={(x) => (`£${x}`)} style={{ tickLabels: { fontSize: 8 }, axisLabel: { padding: 20, fontSize: 8 } }} />
                <VictoryBar
                    style={{ data: { fill: "tomato", opacity: 0.7 } }}
                    data={monthlySpendData}
                    categories={{ x: months }}
                    // data accessor for x values
                    x="month"
                    // data accessor for y values
                    y="monthSpend"
                />
            </VictoryChart>

        </div>
    );
}

export function YearlyIncomeBarTrend({ monthlyIncomeData }: incomeTrendProps) {
    const months = twelveMonthsInOrder()

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <VictoryChart domainPadding={20} theme={VictoryTheme.material} style={{ parent: { maxWidth: "50%" } }} width={550}>
                <VictoryAxis label="Month" style={{ tickLabels: { padding: 5, fontSize: 8 }, axisLabel: { padding: 25, fontSize: 9 } }} />
                <VictoryAxis dependentAxis tickFormat={(x) => (`£${x}`)} style={{ tickLabels: { fontSize: 8 }, axisLabel: { padding: 20, fontSize: 8 } }} />
                <VictoryBar
                    style={{ data: { fill: "tomato", opacity: 0.7 } }}
                    data={monthlyIncomeData}
                    categories={{ x: months }}
                    // data accessor for x values
                    x="month"
                    // data accessor for y values
                    y="monthIncome"
                />
            </VictoryChart>

        </div>
    );
}

export function YearlyIncomeVsSpendingGroupChart({ monthSpendData, monthIncomeData }: groupChartProps) {
    const months = twelveMonthsInOrder()

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <VictoryChart domainPadding={20} theme={VictoryTheme.material} style={{ parent: { maxWidth: "50%" } }} width={550}>
                <VictoryAxis label="Month" style={{ tickLabels: { padding: 5, fontSize: 8 }, axisLabel: { padding: 25, fontSize: 9 } }} />
                <VictoryAxis dependentAxis tickFormat={(x) => (`£${x}`)} style={{ tickLabels: { fontSize: 8 }, axisLabel: { padding: 20, fontSize: 8 } }} />
                <VictoryGroup offset={20} colorScale={["green", "red"]}>
                    <VictoryBar
                        style={{ data: { opacity: 0.7 } }}
                        data={monthIncomeData}
                        categories={{ x: months }}
                        // data accessor for x values
                        x="month"
                        // data accessor for y values
                        y="monthIncome"
                    />
                    <VictoryBar
                    style={{ data: { opacity: 0.7 } }}
                    data={monthSpendData}
                    categories={{ x: months }}
                    // data accessor for x values
                    x="month"
                    // data accessor for y values
                    y="monthSpend"
                />
                </VictoryGroup>
            </VictoryChart>
        </div >
    );
}


