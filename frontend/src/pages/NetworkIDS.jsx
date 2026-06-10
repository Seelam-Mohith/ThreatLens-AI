import { useEffect, useMemo, useState } from 'react'
import { Activity, Play, Shield, Square, Upload, Wifi } from 'lucide-react'

const samplePackets = [
  {
    time: '12:04:11',
    source: '192.168.1.24',
    destination: '172.217.160.78',
    protocol: 'HTTPS',
    status: 'safe',
    note: 'Normal encrypted web session',
  },
  {
    time: '12:04:18',
    source: '10.0.0.45',
    destination: '185.220.101.4',
    protocol: 'TCP',
    status: 'suspicious',
    note: 'Unexpected outbound beacon pattern',
  },
  {
    time: '12:04:25',
    source: '192.168.1.38',
    destination: '8.8.8.8',
    protocol: 'DNS',
    status: 'safe',
    note: 'Known resolver query',
  },
  {
    time: '12:04:31',
    source: '10.0.0.17',
    destination: '203.0.113.92',
    protocol: 'HTTP',
    status: 'suspicious',
    note: 'Clear-text request to unknown host',
  },
  {
    time: '12:04:37',
    source: '192.168.1.90',
    destination: '151.101.1.69',
    protocol: 'TLS',
    status: 'safe',
    note: 'Trusted software update traffic',
  },
]

function NetworkIDS() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedPackets, setCapturedPackets] = useState([])
  const [captureIndex, setCaptureIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [pcapFile, setPcapFile] = useState(null)

  const handleFileSelection = (file) => {
    if (!file) return
    const isPcapFile = file.name.toLowerCase().endsWith('.pcap')
    if (!isPcapFile) return
    setPcapFile(file)
    setIsDragging(false)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    const file = event.dataTransfer.files?.[0]
    handleFileSelection(file)
  }

  useEffect(() => {
    if (!isCapturing) return undefined

    const interval = setInterval(() => {
      const packet = samplePackets[captureIndex % samplePackets.length]
      setCapturedPackets((current) => [packet, ...current].slice(0, 6))
      setCaptureIndex((current) => current + 1)
    }, 1400)

    return () => clearInterval(interval)
  }, [captureIndex, isCapturing])

  const latestPacket = capturedPackets[0]

  const prediction = useMemo(() => {
    if (!latestPacket) {
      return {
        label: 'Waiting for traffic',
        verdict: 'Start capture to view the model prediction for incoming network activity.',
        tone: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200',
      }
    }

    if (latestPacket.status === 'suspicious') {
      return {
        label: 'Potential intrusion detected',
        verdict: 'Not safe to open. The flow shows unusual behavior and should be investigated.',
        tone: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200',
      }
    }

    return {
      label: 'Traffic appears legitimate',
      verdict: 'Safe to open. The captured packet matches expected network behavior.',
      tone: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200',
    }
  }, [latestPacket])

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <Wifi className="w-10 h-10 text-indigo-600" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Network Intrusion Detection</h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl">
          Monitor captured network activity and view a model-backed verdict on whether the observed connection looks safe or suspicious.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-8">
        <section className="card">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Capture Console</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Start a session to populate the captured traffic tab below.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsCapturing(true)}
                disabled={isCapturing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                Start
              </button>
              <button
                onClick={() => setIsCapturing(false)}
                disabled={!isCapturing}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                Stop
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-5 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className={`w-5 h-5 ${isCapturing ? 'animate-pulse' : ''}`} />
                <span className="font-semibold">Captured Network Traffic</span>
              </div>
              <span className="text-sm bg-white/15 px-3 py-1 rounded-full">
                {isCapturing ? 'Capturing' : 'Paused'}
              </span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/40">
              <div className="px-5 py-5 border-b border-gray-200 dark:border-gray-700">
                <label
                  htmlFor="pcap-upload"
                  onDragOver={(event) => {
                    event.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors cursor-pointer ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-800/50'
                  }`}
                >
                  <Upload className="w-8 h-8 text-indigo-600 mb-3" />
                  <span className="text-base font-semibold text-gray-900 dark:text-white">
                    Drag and drop a `.pcap` file here
                  </span>
                  <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    or click to browse and attach a capture file
                  </span>
                  <input
                    id="pcap-upload"
                    type="file"
                    accept=".pcap"
                    className="hidden"
                    onChange={(event) => handleFileSelection(event.target.files?.[0])}
                  />
                </label>

                <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                  {pcapFile ? (
                    <span>
                      Selected file: <span className="font-semibold text-gray-900 dark:text-white">{pcapFile.name}</span>
                    </span>
                  ) : (
                    <span>No `.pcap` file selected yet.</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-[0.9fr_1.2fr_1.2fr_0.8fr] gap-3 px-5 py-3 border-b border-gray-200 dark:border-gray-700 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                <span>Time</span>
                <span>Source</span>
                <span>Destination</span>
                <span>Protocol</span>
              </div>

              {capturedPackets.length > 0 ? (
                capturedPackets.map((packet, index) => (
                  <div
                    key={`${packet.time}-${packet.source}-${index}`}
                    className="px-5 py-4 border-b last:border-b-0 border-gray-200 dark:border-gray-800"
                  >
                    <div className="grid grid-cols-[0.9fr_1.2fr_1.2fr_0.8fr] gap-3 text-sm text-gray-800 dark:text-gray-200">
                      <span>{packet.time}</span>
                      <span>{packet.source}</span>
                      <span>{packet.destination}</span>
                      <span>{packet.protocol}</span>
                    </div>
                    <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">{packet.note}</p>
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          packet.status === 'safe'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-200'
                        }`}
                      >
                        {packet.status === 'safe' ? 'Safe' : 'Suspicious'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                  No packets captured yet. Press Start to begin monitoring.
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-8">
          <div className="card">
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-7 h-7 text-indigo-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Model Prediction</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Latest verdict from the intrusion detection model
                </p>
              </div>
            </div>

            <div className={`rounded-xl p-4 font-semibold ${prediction.tone}`}>
              {prediction.label}
            </div>

            <p className="mt-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              {prediction.verdict}
            </p>

            <div className="mt-6 grid sm:grid-cols-2 gap-4">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-700/40 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Session</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{capturedPackets.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Packets shown</p>
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-700/40 p-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Capture Status</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {isCapturing ? 'Active' : 'Stopped'}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Monitoring state</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detection Summary</h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <p>Traffic flagged as suspicious is treated as not safe to open until reviewed.</p>
              <p>Encrypted traffic to trusted services is labeled safe when no abnormal pattern is present.</p>
              <p>This page is frontend-only for now and demonstrates the IDS monitoring workflow.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default NetworkIDS
