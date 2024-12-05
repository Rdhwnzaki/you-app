const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
    webpack: (config, { isServer, dev }) => {
        if (!isServer && !dev) {
            config.plugins.push(
                new InjectManifest({
                    swSrc: './src/app/sw.js',
                    swDest: 'public/sw.js',
                })
            );
        }
        return config;
    },
};
