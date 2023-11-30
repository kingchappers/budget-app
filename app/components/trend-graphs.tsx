"use client"

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryGroup, VictoryLegend, VictoryPie } from 'victory';
import { twelveMonthsInOrder } from './trend-calculations';

interface barTrendProps {
    monthlyData: monthData[],
}

export interface monthData {
    month: string,
    value: number,
}

interface groupChartProps {
    monthSpendData: monthData[],
    monthIncomeData: monthData[]
}

export interface categoryData {
    category: string,
    value: number,
}

export interface categorySplitPieProps {
    categoryData: categoryData[],
    month: Date,
    monthTotal: number,
}

export function YearlySpendBarTrend({ monthlyData }: barTrendProps) {
    const months = twelveMonthsInOrder()

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <VictoryChart domainPadding={20} theme={VictoryTheme.material} style={{ parent: { maxWidth: "50%" } }} width={550}>
                <VictoryAxis label="Month" style={{ tickLabels: { padding: 5, fontSize: 8 }, axisLabel: { padding: 25, fontSize: 9 } }} />
                <VictoryAxis dependentAxis tickFormat={(x) => (`£${x}`)} style={{ tickLabels: { fontSize: 8 }, axisLabel: { padding: 20, fontSize: 8 } }} />
                <VictoryBar
                    style={{ data: { fill: "tomato", opacity: 0.7 } }}
                    data={monthlyData}
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

export function YearlyIncomeBarTrend({ monthlyData }: barTrendProps) {
    const months = twelveMonthsInOrder()

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <VictoryChart domainPadding={20} theme={VictoryTheme.material} style={{ parent: { maxWidth: "50%" } }} width={550}>
                <VictoryAxis label="Month" style={{ tickLabels: { padding: 5, fontSize: 8 }, axisLabel: { padding: 25, fontSize: 9 } }} />
                <VictoryAxis dependentAxis tickFormat={(x) => (`£${x}`)} style={{ tickLabels: { fontSize: 8 }, axisLabel: { padding: 20, fontSize: 8 } }} />
                <VictoryBar
                    style={{ data: { fill: "tomato", opacity: 0.7 } }}
                    data={monthlyData}
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
                <VictoryLegend x={200}
                    title="Legend"
                    centerTitle
                    orientation="horizontal"
                    gutter={20}
                    style={{ border: { stroke: "black" }, title: { fontSize: 20 } }}
                    data={[
                        { name: "Income", symbol: { fill: "green" } },
                        { name: "Expenses", symbol: { fill: "red" } },
                    ]}
                />
                <VictoryGroup offset={20} colorScale={["green", "red"]}>

                    <VictoryBar
                        style={{ data: { opacity: 0.7 } }}
                        data={monthIncomeData}
                        categories={{ x: months }}
                        // data accessor for x values
                        x="month"
                        // data accessor for y values
                        y="value"
                    />
                    <VictoryBar
                        style={{ data: { opacity: 0.7 } }}
                        data={monthSpendData}
                        categories={{ x: months }}
                        // data accessor for x values
                        x="month"
                        // data accessor for y values
                        y="value"
                    />
                </VictoryGroup>
            </VictoryChart>
        </div >
    );
}

export function MonthSpendingCategorySplit({ categoryData, month, monthTotal }: categorySplitPieProps) {
    const monthAsString = month.toLocaleString('default', { month: 'short' }) + " " + month.getFullYear().toLocaleString().substring(3)
    return (
        <div className="container mx-auto max-w-screen-2xl p-4">
            <h1 className="text-l font-bold text-center">{monthAsString}</h1>
            <VictoryPie
                data={categoryData}
                x="category"
                y="value"
                theme={VictoryTheme.material}
                style={{ parent: { maxWidth: "100%" } }}
                width={550}
            />
        </div>
    )
}