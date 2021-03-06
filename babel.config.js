const plugins = [
    '@babel/plugin-proposal-private-methods',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime'];

module.exports = {
    presets: [
        ['@babel/env', {
            targets: {
                node: 'current',
                firefox: '60',
                chrome: '67',
                safari: '11.1',
            },
        }],
    ],
    plugins: plugins,
};