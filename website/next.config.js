/** @type {import('next').NextConfig} */
const nextConfig = {
    // Use SWC minification for faster builds
    swcMinify: true,

    // Optimize bundle for production
    productionBrowserSourceMaps: false,

    // Faster development builds
    webpack: (config, { dev, isServer }) => {
        // Reduce chunk size for faster hot reload
        if (dev && !isServer) {
            config.optimization.splitChunks = {
                chunks: 'all',
                cacheGroups: {
                    default: false,
                    vendors: false,
                },
            };
        }
        return config;
    },

    // Disable telemetry for faster startup
    // compiler: {
    //     removeConsole: process.env.NODE_ENV === 'production',
    // },
};

module.exports = nextConfig;
