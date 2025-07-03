module.exports = {
    presets: ['module:@react-native/babel-preset'],
    plugins: [
        ['@babel/transform-runtime'],
    ],
    // Important part ⋁
    overrides: [
        {
            test:    fileName => !fileName.includes('node_modules/react-native-maps'),
            plugins: [
                ['@babel/plugin-transform-class-properties', {loose: true}],
                ['@babel/plugin-transform-private-methods', {loose: true}],
                ['@babel/plugin-transform-private-property-in-object', {loose: true}],
            ],
        },
    ],
    // Important part ⋀
    env: {
        production: {
            plugins: [
                'transform-remove-console',
            ],
        },
    },
};