'use client'

import { useState } from 'react'
import { Upload, FileIcon, AlertCircle, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function UploadPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      // Check file size
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File too large. Max 10MB allowed.')
        return
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel']
      if (!allowedTypes.includes(selectedFile.type)) {
        setError('Invalid file type. Only PDF, Word, and Excel documents allowed.')
        return
      }

      setError(null)
      setFile(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Upload failed')
        setUploading(false)
        return
      }

      setSuccess(true)
      setUploadProgress(100)

      // Redirect to payment page after 2 seconds
      setTimeout(() => {
        router.push(`/payment?uploadId=${data.uploadId}`)
      }, 2000)
    } catch (err) {
      setError('Failed to upload file. Please try again.')
      console.error(err)
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-md mb-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Upload Document</h1>
          <Link href="/dashboard">
            <button className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium">
              ← Back to Dashboard
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Upload Your Document</h2>
          <p className="text-slate-600 mb-8">Select a PDF, Word, or Excel file to print</p>

          {/* Upload Area */}
          <div className="mb-8">
            <label className="block">
              <div className="border-2 border-dashed border-blue-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all duration-300">
                <Upload className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-900 mb-2">
                  Drop your file here or click to browse
                </p>
                <p className="text-sm text-slate-600">
                  Supported: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
                </p>
                <p className="text-xs text-slate-500 mt-2">Maximum file size: 10 MB</p>
              </div>
              <input
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                className="hidden"
              />
            </label>
          </div>

          {/* Selected File */}
          {file && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileIcon className="w-6 h-6 text-blue-600" />
                <div>
                  <p className="font-semibold text-slate-900">{file.name}</p>
                  <p className="text-sm text-slate-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-sm px-3 py-1 bg-white text-slate-700 rounded hover:bg-slate-100 transition"
              >
                Change
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-green-700 font-semibold text-sm">Upload successful!</p>
                <p className="text-green-600 text-sm">Redirecting to payment...</p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          {uploading && (
            <div className="mb-8">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-slate-600 mt-2">Uploading... {uploadProgress}%</p>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={!file || uploading || success}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold rounded-lg transition shadow-lg shadow-blue-600/20"
          >
            {uploading ? 'Uploading...' : success ? 'Upload Complete' : 'Upload & Proceed to Payment'}
          </button>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-2">How it works:</h3>
            <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
              <li>Upload your document</li>
              <li>Select printing options (single/double-sided, binding, etc.)</li>
              <li>Complete payment via Razorpay</li>
              <li>Get a 4-digit OTP to pickup your prints</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}
