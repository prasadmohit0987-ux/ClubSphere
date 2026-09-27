const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
    {
        ignores: [
            "node_modules/**",
            "database/**"
        ]
    },

    js.configs.recommended,

    {
        files: [
            "eslint.config.js",
            "server.js",
            "database.js",
            "tests/**/*.js"
        ],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",

            globals: {
                ...globals.node,
                ...globals.jest
            }
        },

        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error"
        }
    },

    {
        files: [
            "public/js/**/*.js"
        ],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "script",

            globals: {
                ...globals.browser
            }
        },

        rules: {
            "no-unused-vars": "warn",
            "no-undef": "error"
        }
    }
];