import Link from 'next/link'
import Image from 'next/image'

interface LogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'default' | 'white'
}

export function Logo({ className = '', showText = true, size = 'md', variant = 'default' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }

  const iconColor = variant === 'white' ? '#FFFFFF' : '#1A531A'
  const textColor = variant === 'white' ? 'text-white' : 'text-[#1A531A]'
  const underlineColor = variant === 'white' ? '#FFFFFF' : '#90B890'

  // Logo image dimensions based on size - maintaining aspect ratio
  const logoDimensions = {
    sm: { width: 120, height: 48 },
    md: { width: 180, height: 72 },
    lg: { width: 240, height: 96 },
    xl: { width: 300, height: 120 },
  }

  const dims = logoDimensions[size]

  const logoImage = (
    <Image
      src="/Untitled design.png"
      alt="HomeSwift Logo"
      width={dims.width}
      height={dims.height}
      className="h-full w-auto object-contain"
      style={{ maxHeight: size === 'sm' ? '2rem' : size === 'md' ? '3rem' : size === 'lg' ? '4rem' : '5rem' }}
      priority={size === 'lg' || size === 'xl'}
    />
  )

  // Since the image already includes the text and logo, we always show just the image
  return (
    <Link href="/" className={`inline-flex items-center ${className}`}>
      {logoImage}
    </Link>
  )
}

