
const path = require("path");

const sharedPath = path.resolve(__dirname, "../shared");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            // Autoriser les imports en dehors de src
            webpackConfig.resolve.plugins =
                webpackConfig.resolve.plugins.filter(
                    (plugin) =>
                        plugin.constructor.name !== "ModuleScopePlugin"
                );

            // Alias partagé
            webpackConfig.resolve.alias = {
                ...webpackConfig.resolve.alias,
                "@shared": sharedPath
            };

            // Ajouter shared aux chemins traités par Babel
            const oneOfRule = webpackConfig.module.rules.find(
                (rule) => Array.isArray(rule.oneOf)
            );

            if (!oneOfRule) {
                throw new Error("Configuration Babel introuvable.");
            }

            const babelLoader = oneOfRule.oneOf.find(
                (rule) =>
                    rule.loader &&
                    rule.loader.includes("babel-loader") &&
                    rule.options
            );

            if (!babelLoader) {
                throw new Error("Babel Loader introuvable.");
            }

            babelLoader.include = [
                ...(Array.isArray(babelLoader.include)
                    ? babelLoader.include
                    : [babelLoader.include].filter(Boolean)),
                sharedPath
            ];

            return webpackConfig;
        }
    }
};
