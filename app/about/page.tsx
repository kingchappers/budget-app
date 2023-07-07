
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl items-center justify-between font-mono">
        <h1 className="text-4xl font-extrabold mb-5">About</h1>
        <p className="mb-5">FIN is designed to be a personal budgeting app to help people manage their finances and understand where their money is going. I've used a few different personal budgeting apps, but of those that I've tried most of them had something that I didn't like so I always went back to upkeeping a large spreadsheet of my transactions. This quickly becomes a bit difficult to manage and I've always been reluctant to add complicated functions to spreadsheets, mainly because I don't find them very easy to use.</p>
        <p className="mb-5">My aim here is to design an application that can be used to record my earnings, spending, and report on it in a way that makes sense to me.</p>
        
        <p className="mb-5">Personally I don't like linking my credit or debit accounts to budgeting apps, both from a personal security perspective and because I find there to be problems with this. Because I do most of my spending on my credit cards but use direct debits for regular payments my ideal would be to link both to a budgeting app, however, doing this generally means that individual items are added to the app which is great but when I pay off my card via direct debit that charge is then added to the app. It then reflects poorly on the app unless there's some way of removing an individual charge, which is normally a bit of a pain.</p>

        <p className="mb-5">It's for this reason that I am making this app manual. I believe that manually entering payments into the app also makes the spending of money feel more real. In the future I may look into implementing the Open Banking API, but for now this isn't part of my plan while I'm trying to get the app working to meet my personal requirements.</p>
      </div>
    </main>
  )
}
