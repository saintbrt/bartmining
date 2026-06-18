'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function ExplorePage() {
  const router = useRouter()
  useEffect(() => { router.replace('/admin/explore/overview') }, [router])
  return null
}
