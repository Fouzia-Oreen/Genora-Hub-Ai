// components/CopyDownloadButtons.jsx
import { Copy, Download } from 'lucide-react'

export default function CopyDownloadButtons({ onCopy, onDownload }) {
  return (
    <div className="flex gap-3">
      <Copy
        className="w-5 cursor-pointer text-color_5"
        title="Copy all"
        onClick={onCopy}
      />
      <Download
        className="w-5 cursor-pointer text-color_5"
        title="Download CSV"
        onClick={onDownload}
      />
    </div>
  )
}
