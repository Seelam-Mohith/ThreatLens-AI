import { Activity } from 'lucide-react'

const emailModels = [
  { model: 'LinearSVM', accuracy: 98.89, precision: 99, recall: 99, f1: 99 },
  { model: 'Logistic Regression', accuracy: 98.43, precision: 99, recall: 98, f1: 98 },
  { model: 'XGBoost', accuracy: 88.6, precision: 97, recall: 77, f1: 86 },
]

const smsModels = [
  { model: 'Linear SVM', accuracy: 95.4, precision: 95.21, recall: 95.4, f1: 95.28 },
  { model: 'Logistic Regression', accuracy: 93.97, precision: 93.72, recall: 93.97, f1: 93.81 },
  { model: 'Multinomial NB', accuracy: 93.81, precision: 93.47, recall: 93.81, f1: 93.11 },
]

const urlModels = [
  { model: 'Linear SVM', accuracy: 97.65, precision: 97.41, recall: 97.22, f1: 97.31 },
  { model: 'Random Forest', accuracy: 95.1, precision: 94.62, recall: 94.8, f1: 94.71 },
  { model: 'XGBoost', accuracy: 93.8, precision: 93.11, recall: 93.25, f1: 93.18 },
]

function ModelTable({ data, highlight }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b-2 border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Model</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Accuracy</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Precision</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Recall</th>
            <th className="text-center py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">F1 Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={row.model}
              className={`border-b border-gray-100 dark:border-gray-700 transition-colors ${
                highlight === row.model
                  ? 'bg-indigo-50 dark:bg-indigo-900/30'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
            >
              <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-semibold ${
                      idx === 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : idx === 1
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>{row.model}</span>
                </div>
              </td>
              <td className="py-3 px-4 text-center">
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-semibold">
                  {row.accuracy.toFixed(2)}%
                </span>
              </td>
              <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{row.precision.toFixed(2)}%</td>
              <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{row.recall.toFixed(2)}%</td>
              <td className="py-3 px-4 text-center text-gray-700 dark:text-gray-300">{row.f1.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ModelCard({ title, description, data, highlight }) {
  return (
    <div className="card">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <ModelTable data={data} highlight={highlight} />
    </div>
  )
}

function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Model Statistics</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Inspect model performance by analysis type</p>
      </div>

      <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="flex items-start gap-4">
          <Activity className="w-8 h-8 text-indigo-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Overview</h3>
            <p className="text-gray-700 dark:text-gray-300">
              The dashboard now focuses on three detailed model groups: Email, SMS, and URL analysis, so the
              performance of each detection path is easier to compare at a glance.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-8">
        <ModelCard
          title="Email Models"
          description="Models trained for email phishing detection and their performance."
          data={emailModels}
          highlight="LinearSVM"
        />

        <ModelCard
          title="SMS Models"
          description="Models for SMS/scam detection and message threat classification."
          data={smsModels}
          highlight="Linear SVM"
        />

        <ModelCard
          title="URL Models"
          description="Models focused on URL and link threat detection."
          data={urlModels}
          highlight="Linear SVM"
        />
      </div>
    </div>
  )
}

export default Dashboard
