# HealthEase

HealthEase is a backoffice application built with React Admin. This document provides an overview of all major features available and developer instructions on how to run the project using different methods.

## ESLint and Prettier

This project uses ESLint and Prettier to enforce code quality and formatting standards. The configuration files for these tools are included in the project, ensuring that your code adheres to the defined rules.

### ESLint

ESLint is a static code analysis tool that helps identify and fix common errors and coding style issues in JavaScript code. The ESLint configuration for this project is defined in the `.eslintrc.js` file.

To run ESLint and check your code for errors or warnings, you can use the following command:

```sh
yarn lint
```

> **Note:** You can also use `yarn lint:fix` to automatically fix some of the issues reported by ESLint.

ESLint errors will only be displayed when running this command and will not bother the developer during development.

### Prettier

Prettier is an opinionated code formatter that enforces a consistent code style across your project. The Prettier configuration is defined in the `.prettierrc` file.

To format your code with Prettier, you can use the following command:

```sh
yarn format
```

### Integration with Editor

Ensure that your code editor is set up to use ESLint and Prettier. Most editors have plugins or extensions that integrate these tools, making it easier to maintain code quality and style during development.

For Prettier, JetBrains IDEs support an interesting feature that formats the code automatically upon saving a file (`ctrl+s`). To enable this feature, follow these steps:

-   Open the IDE settings (`ctrl+Comma`).
-   Navigate to the `Languages and Frameworks` section.
-   Select `JavaScript`.
-   Enable `automatic Prettier configuration.`
-   Check the `Run on save` option.

By enabling this, your code will be automatically formatted whenever you save changes to any file, ensuring consistent code style effortlessly.

## Unit Tests

### Running tests

To run the tests, you can use the following command:

```sh
yarn test
```

[Jest](https://jestjs.io/) will automatically run all tests in your project and display the result in the terminal.

### Running tests with coverage

To run the tests with coverage, you can use the following command:

```sh
  yarn test --coverage
```

-   This will generate a coverage report and display it in the terminal.
-   The coverage report will also be available in the `coverage` directory generated in the root of the project.
-   You can open the `index.html` file in the `coverage/lcov-report` directory to view the coverage report in your browser.

### Running a specific test or test file

You can specify a single test file or a single test method to run by passing the file or method name as an argument to the yarn test command.

```sh
yarn test -t "Test Name"
```

# Run Unit Tests:

1. Install the test dependencies, using the `yarn install` command in the terminal.
2. In the terminal, run the `yarn test` command in the root of your project.

[Jest](https://jestjs.io/) will automatically run all tests in your project and display the result in the terminal.

You can specify a single test file or a single test method to run by passing the file or method name as an argument to the yarn test command.

```
yarn test -t "Test Name"
```

# Debugging Unit Tests in [WebStorm](https://www.jetbrains.com/webstorm/):

1. Add configuration template from [Jest debug](https://www.jetbrains.com/help/webstorm/run-debug-configuration.html#change-template):
    1. Open the `Run` > `Edit Configurations...` menu
    2. Open the `Run` menu > `Edit configuration templates...`
    3. Choose the `Jest` template
        1. `Jest package`: `"<YOURDIR>/healthease-backoffice/node_modules/react-scripts"`
        2. `Working Directory`: `"<YOURDIR>/healthease-backoffice"`
        3. `Jest Options`: `"--roots test/ --testMatch './**/*.{spec,test}.{js,jsx,ts,tsx}'"`
        4. Choose the `All tests` option.
    4. Click on `Apply` and then on `OK`
2. Open the test file you want to debug.
3. Right-click on the test method name and select `"Debug 'Test method name'"` from the options list.
4. [WebStorm](https://www.jetbrains.com/webstorm/) will start the debugging process and stop at the first line of code within the test method.
5. Use debugging tools, such as step-by-step, variable inspection, and breakpoints, to investigate the code and find the problem.
6. When finished, click the "Stop" button on the toolbar to interrupt the debugging process.

> **Note**: For further information on debugging, please refer to the official [WebStorm documentation on debugging](https://blog.jetbrains.com/webstorm/2018/01/how-to-debug-with-webstorm/).
