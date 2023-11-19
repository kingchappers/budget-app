import { YearlySpendTrend } from '../components/trend-graphs';

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

            <YearlySpendTrend />

        </div>
    );
}