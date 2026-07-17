'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PlantPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/plant/overview') }, [router])
  return null
}
