'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { getProject, type ProjectRow } from '@/lib/proposals/db'
import { projectModel } from '@/lib/proposals/model'
import { ProposalDocument } from '@/components/proposals/planner/views/Proposal'
import { useImagesReady } from '@/components/proposals/useImagesReady'

/* The proposal alone, as the client receives it. Printed to PDF by
   /api/admin/pdf and /api/admin/send; data-print-ready tells Chrome the
   document and its images have loaded. */
export default function ProposalPrint() {
  const { id } = useParams<{ id: string }>()
  const [row, setRow] = useState<ProjectRow | null | undefined>(undefined)
  useEffect(() => { getProject(id).then(setRow) }, [id])
  const model = useMemo(() => (row ? projectModel(row.data) : null), [row])
  const ref = useRef<HTMLDivElement>(null)
  const ready = useImagesReady(ref, !!model)

  useEffect(() => { if (row) document.title = row.data.meta.proposalNo ? `${row.data.meta.proposalNo} Rev ${row.data.meta.revision ?? 'A'}` : row.data.meta.name }, [row])

  if (row === null) return <p className="bm-print-msg">Project not found, or this account can&apos;t open it.</p>
  return (
    <div ref={ref} className="pp pp-print" {...(ready ? { 'data-print-ready': '' } : {})}>
      {row && model && <ProposalDocument project={row.data} model={model} />}
    </div>
  )
}
