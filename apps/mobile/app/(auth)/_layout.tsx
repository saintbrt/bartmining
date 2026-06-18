import { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { supabase } from '../../lib/supabase/client'

export default function AuthLayout() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/(app)/explore')
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      if (session) router.replace('/(app)/explore')
    })
    return () => subscription.unsubscribe()
  }, [router])

  return <Stack screenOptions={{ headerShown: false }} />
}
