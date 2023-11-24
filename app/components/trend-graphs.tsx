"use client"

import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';

export interface spendTrendProps{
    monthlySpendData: monthSpendData[]
}

export interface monthSpendData {
    month: string,
    monthSpend: number,
}

export function YearlySpendTrend({monthlySpendData}: spendTrendProps) {

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <VictoryChart domainPadding={20} theme={VictoryTheme.material} style={{ parent: { maxWidth: "50%" } }}>
                {/* <VictoryAxis tickValues={[1, 2, 3, 4]} tickFormat={["Month 1", "Month 2", "Month 3", "Month 4"]} /> */}
                <VictoryAxis tickValues={[12, 11,]} label="Month" style={{tickLabels: {fontSize: 5}, axisLabel: {padding: 20, fontSize: 8}}}/>
                <VictoryAxis dependentAxis tickFormat={(x) => (`£${x}`)}/>
                <VictoryBar
                    data={monthlySpendData}
                    // data accessor for x values
                    x="month"
                    // data accessor for y values
                    y="monthSpend"
                />
            </VictoryChart>

        </div>
    );
}