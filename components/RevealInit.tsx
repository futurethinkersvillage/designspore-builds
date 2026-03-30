'use client'

import { useEffect } from 'react'
import { initReveal } from '@/lib/reveal'

export default function RevealInit() {
  useEffect(() => {
    initReveal()
  }, [])
  return null
}
