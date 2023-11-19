import { YearlySpendTrend } from '../components/trend-graphs';

export default async function Trends() {
    const yearSpendData = [
        { month: 1, monthsSpend: 13000 },
        { month: 2, monthsSpend: 16500 },
        { month: 3, monthsSpend: 14250 },
        { month: 4, monthsSpend: 19000 }
    ];

    return (
        <div className="container mx-auto max-w-screen-2xl p-4">

            <h1 className="text-2xl font-bold mb-4">Spending and Income Trends</h1>

            <YearlySpendTrend yearSpendData={yearSpendData} />

        </div>
    );
}