module.exports = {
    /* your base configuration of choice */
    extends: 'airbnb',
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    plugins: [
        "flowtype"
    ],
    env: {
        browser: true,
    },
    rules: {
        'import/no-unresolved': 0,
        "import/extensions": 0,
        "prefer-const": ["error", {
            "destructuring": "any",
            "ignoreReadBeforeAssign": false
        }],
        "no-use-before-define": [2, {
            "functions": false,
            "classes": false
        }],
        "no-restricted-syntax": [
            "error",
            "ForInStatement",
            "LabeledStatement",
            "WithStatement"
        ],
        "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
        "indent": ["error", 4],
        "react/jsx-indent": ["error", 4],
        "react/jsx-indent-props": ["error", 4],
        "react/no-array-index-key": 0,
        "quotes": ["error", "double"],
        "no-else-return": "off",
        "no-plusplus": "off",
        "react/destructuring-assignment": 0,
        "react/require-default-props": 0,
        "react/forbid-prop-types": 0,
        "import/prefer-default-export": 1,
        "react/no-multi-comp": 0,
        "jsx-a11y/click-events-have-key-events": 0,
        "jsx-a11y/no-static-element-interactions": 0,
        "no-continue": 0,
        "react/prop-types": 0,
        "import/no-cycle": 0,
        "no-console": 0,
        "import/no-webpack-loader-syntax": 0,
        "import/no-extraneous-dependencies": ["error", { "devDependencies": true }],
        "jsx-a11y/label-has-associated-control": [2, {
            "assert": "either",
        }],
        "flowtype/define-flow-type": 1,
    }
};
