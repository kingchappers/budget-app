"use client"

import React from 'react';
import ReactDOM from 'react-dom';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryContainer } from 'victory';

export default async function Trends() {
    const data = [
        { quarter: 1, earnings: 13000 },
        { quarter: 2, earnings: 16500 },
        { quarter: 3, earnings: 14250 },
        { quarter: 4, earnings: 19000 }
    ];

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>
            <VictoryContainer>
            {/* <div className="w-60"> */}
                <VictoryChart domainPadding={20} theme={VictoryTheme.material} style={{ parent: { maxWidth: "20%" } }}>
                    <VictoryAxis tickValues={[1, 2, 3, 4]} tickFormat={["Quarter 1", "Quarter 2", "Quarter 3", "Quarter 4"]} />
                    <VictoryAxis dependentAxis tickFormat={(x) => (`$${x / 1000}k`)}
                    />
                    <VictoryBar
                        data={data}
                        // data accessor for x values
                        x="quarter"
                        // data accessor for y values
                        y="earnings"
                    />
                </VictoryChart>
            {/* </div> */}
            </VictoryContainer>

        </div>
    );
}