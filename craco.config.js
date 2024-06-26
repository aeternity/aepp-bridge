// eslint-disable-next-line @typescript-eslint/no-var-requires
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CracoEsbuildPlugin = require('craco-esbuild');
const webpack = require('webpack');

module.exports = {
    plugins: [
        {
            plugin: CracoEsbuildPlugin,
            options: {
                esbuildLoaderOptions: {
                    // Optional. Defaults to auto-detect loader.
                    loader: 'tsx',
                    target: 'es2020',
                },
                esbuildMinimizerOptions: {
                    // Optional. Defaults to:
                    target: 'es2020',
                    css: true, // if true, OptimizeCssAssetsWebpackPlugin will also be replaced by esbuild.
                },
                skipEsbuildJest: true, // Optional. Set to true if you want to use babel for jest tests,
            },
        },
    ],
    eslint: { enable: false },
    webpack: {
        configure: (config) => {
            // Remove ModuleScopePlugin which throws when we try to import something
            // outside of src/.
            config.resolve.plugins.pop();

            // Resolve the path aliases.
            config.resolve.plugins.push(new TsconfigPathsPlugin());
            config.resolve.fallback = {
                path: false,
                assert: false,
                http: false,
                https: false,
                url: false,
                os: false,
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                buffer: require.resolve('buffer'),
            };

            // Let Babel compile outside of src/.
            const oneOfRule = config.module.rules.find((rule) => rule.oneOf);
            const tsRule = oneOfRule.oneOf.find((rule) => rule.test.toString().includes('ts|tsx'));

            tsRule.include = undefined;
            tsRule.exclude = /node_modules/;

            config.module.rules.push({
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            });

            return config;
        },
        plugins: {
            remove: [
                // This plugin is too old and causes problems in monorepos. We'll
                // replace it with a newer version.
                'ForkTsCheckerWebpackPlugin',
            ],
            add: [
                // Use newer version of ForkTSCheckerWebpackPlugin to type check
                // files across the monorepo.
                new ForkTSCheckerWebpackPlugin({
                    issue: {
                        // The exclude rules are copied from CRA.
                        exclude: [
                            {
                                file: '**/src/**/__tests__/**',
                            },
                            {
                                file: '**/src/**/?(*.)(spec|test).*',
                            },
                            {
                                file: '**/src/setupProxy.*',
                            },
                            {
                                file: '**/src/setupTests.*',
                            },
                        ],
                    },
                }),
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                }),
            ],
        },
    },
};
