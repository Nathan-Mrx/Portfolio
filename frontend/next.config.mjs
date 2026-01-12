import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
{
    protocol: 'http',
    hostname: 'nathan-mrx.com', // Replace with your actual domain
},
{
    protocol: 'https',
    hostname: 'nathan-mrx.com',
},
        ],
    },
};

export default withNextIntl(nextConfig);
