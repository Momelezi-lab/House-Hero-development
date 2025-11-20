import { useQuery } from '@tanstack/react-query'
import { pricingApi } from '@/lib/api'

export function usePricingCategories() {
  return useQuery({
    queryKey: ['pricing', 'categories'],
    queryFn: () => pricingApi.getCategories(),
  })
}

export function usePricingByCategory(category: string | null) {
  return useQuery({
    queryKey: ['pricing', category],
    queryFn: () => pricingApi.getPricingByCategory(category!),
    enabled: !!category,
  })
}

