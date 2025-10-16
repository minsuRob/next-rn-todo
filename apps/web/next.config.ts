import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Transpile shared packages
  transpilePackages: ['@repo/ui', '@repo/hooks', '@repo/api', '@repo/utils', '@repo/types'],

  // Skip type checking and linting during build (handled by CI)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack configuration for React Native Web
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Alias react-native to react-native-web
      'react-native': 'react-native-web',
    }

    // Add react-native-web extensions
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      ...config.resolve.extensions,
    ]

    return config
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['@repo/ui', '@repo/hooks'],
  },
}

export default nextConfig
