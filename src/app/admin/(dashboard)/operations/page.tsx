'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OperationsPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/operations/overview') }, [router])
  return null
}
