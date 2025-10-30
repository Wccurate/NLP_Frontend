import type { FC } from 'react'
import type { SourceItem } from '../types'

export interface SourceListProps {
  sources: SourceItem[]
}

const formatNumber = (value: number | null | undefined) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '—'
  }
  return value.toFixed(3)
}

export const SourceList: FC<SourceListProps> = ({ sources }) => {
  if (!sources?.length) {
    return null
  }

  const hasScore = sources.some((item) => item.score !== null && item.score !== undefined)
  const hasBm25Raw = sources.some(
    (item) => item.bm25_raw_score !== null && item.bm25_raw_score !== undefined,
  )
  const hasDenseDistance = sources.some(
    (item) => item.dense_distance !== null && item.dense_distance !== undefined,
  )

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
        <thead className="bg-slate-50">
          <tr>
            <th scope="col" className="px-4 py-2 font-semibold">
              Source ID
            </th>
            <th scope="col" className="px-4 py-2 font-semibold">
              Snippet / Text
            </th>
            {hasScore ? (
              <th scope="col" className="px-4 py-2 font-semibold">
                Score
              </th>
            ) : null}
            <th scope="col" className="px-4 py-2 font-semibold">Hybrid</th>
            <th scope="col" className="px-4 py-2 font-semibold">Dense</th>
            <th scope="col" className="px-4 py-2 font-semibold">BM25</th>
            {hasBm25Raw ? (
              <th scope="col" className="px-4 py-2 font-semibold">
                BM25 Raw
              </th>
            ) : null}
            {hasDenseDistance ? (
              <th scope="col" className="px-4 py-2 font-semibold">
                Dense Dist.
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {sources.map((item) => (
            <tr key={item.source}>
              <td className="px-4 py-3 align-top font-medium text-slate-900">
                {item.source}
              </td>
              <td className="px-4 py-3 align-top text-slate-700">
                {item.text}
              </td>
              {hasScore ? (
                <td className="px-4 py-3 align-top">{formatNumber(item.score)}</td>
              ) : null}
              <td className="px-4 py-3 align-top">{formatNumber(item.hybrid_score)}</td>
              <td className="px-4 py-3 align-top">{formatNumber(item.dense_score)}</td>
              <td className="px-4 py-3 align-top">{formatNumber(item.bm25_score)}</td>
              {hasBm25Raw ? (
                <td className="px-4 py-3 align-top">
                  {formatNumber(item.bm25_raw_score)}
                </td>
              ) : null}
              {hasDenseDistance ? (
                <td className="px-4 py-3 align-top">
                  {formatNumber(item.dense_distance)}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
