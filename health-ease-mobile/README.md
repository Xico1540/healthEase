# HealthEase

HealthEase app is a mobile application built using React Native. This document provides an overview of all major features available and developer instructions on how to run the project using different methods.

## Local Development

### Using Local IP Address

Alternatively, the local IP address can be used in the React Native development app to reload without USB:

1. Shake the device or long press the menu button to open the developer menu.
2. Open Dev Settings and tap "Debug server host & port for device."
3. Enter the machine's local IP with port number 8090. For example, if the machine's IP is `192.168.1.100`, enter `192.168.1.100:8090`.

Once configured, the same IP with the server's port number should be used to connect to the local machine's development server.

This configuration should enable reloading the app and using the local development server successfully.

> The environment variables must be defined in the `.env` file to ensure the app can connect to the local services and next seteps can be followed.

### Running the Project

The React Native development process can be significantly streamlined and enhanced using [Expo Go](https://expo.dev/go) or [Expo Dev Client](https://docs.expo.dev/versions/latest/sdk/dev-client/). These tools allow you to run the application on a physical device or emulator and provide real-time updates during development.

Some native functionalities are only active when using the Expo Dev Client. For example, features like themed splash screens (such as dark mode splash screens) will only appear correctly when the application is installed natively using the Expo Dev Client. This allows you to take advantage of deeper native integrations and more customization options that are not available with Expo Go.

Follow the instructions below to run the project using one of the methods presented. Please note that you have to set up the emulators or physical device to run the project.

#### Prerequisites

-   If this is the first time you have cloned the application or to grant you have all the dependencies, run this command: `yarn install`
-   To run on physical devices (optional, since you can run on device using USB connection), install the Expo Go app on your **mobile** device from:
    -   Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US)
    -   iOS: [App Store](https://apps.apple.com/us/app/expo-go/id982107779)

### A. Using Expo Go

1. **Start the Development Server**

    Start the Expo development server, which will bundle your React Native project and provide a QR code for quick access to open the app in a physical device, along with the options to open the app in an emulator or web browser.

    ```sh
    yarn start
    ```

2. **Open the app**

-   i). **On a physical mobile device**

    Open the Expo Go app on your physical mobile device and scan the QR code displayed in the terminal or browser. This will load your project in the Expo Go app. For more detailed instructions, please refer to: [Running the Project via Local Network](#running-the-project-via-local-network).

-   ii). **On a web or emulator (requires further configuration, see section [Config Emulators](#Config-Emulators))**

    From the options displayed in the terminal, you can press:

    -   `a` to open the project in an Android emulator.
    -   `i` to open the project in an iOS simulator.
    -   `w` to open the project in a web browser

### B. Using Expo Dev Client

1. **Prebuild and Install Expo Dev Client Dependencies:**

    Prebuild your project for the Android or iOS platform and install the necessary dependencies for the Expo Dev Client. This step ensures your project is configured correctly for native builds.

    - i). **For Android**

        ```sh
        yarn expo prebuild -p android
        ```

    - ii). **For iOS**
        ```sh
        yarn expo prebuild -p ios
        ```

2. **Start the Development Server and Run on Android or iOS:**

    Start the development server and launch your project on an Android or iOS device or emulator using the Expo Dev Client. This command will build and run your project on the specified platform.

    - i). **For Android**

        ```sh
        yarn expo run:android
        ```

    - ii). **For iOS**
        ```sh
        yarn expo run:ios
        ```

## Config Emulators

### A. Android Emulator

To set up an Android emulator, you'll need Android Studio installed. Follow these steps to create and configure an emulator:

1. **Install Android Studio:**

    - Download and install Android Studio from the [official website](https://developer.android.com/studio).

2. **Set Up Environment Variables:**

    - Ensure you have set the `ANDROID_HOME` environment variable to point to your Android SDK location. Additionally, add the SDK's `tools` and `platform-tools` directories to your system's `PATH`.

    ```sh
    # On macOS or Linux, add these lines to your ~/.bash_profile, ~/.zshrc, or ~/.profile
    export ANDROID_HOME=$HOME/Android/Sdk
    export PATH=$PATH:$ANDROID_HOME/emulator
    export PATH=$PATH:$ANDROID_HOME/tools
    export PATH=$PATH:$ANDROID_HOME/tools/bin
    export PATH=$PATH:$ANDROID_HOME/platform-tools

    # On Windows, add these to your system environment variables
    # ANDROID_HOME -> C:\Users\<Your-Username>\AppData\Local\Android\Sdk
    # Add to PATH -> %ANDROID_HOME%\emulator, %ANDROID_HOME%\tools, %ANDROID_HOME%\tools\bin, %ANDROID_HOME%\platform-tools
    ```

3. **Open Android Studio and Configure the Android Virtual Device (AVD):**

    - **Start Android Studio** and select **AVD Manager** from the "Configure" menu.

    - **Create a new virtual device:**

        - Click on **Create Virtual Device**.
        - Select a device model (e.g., Pixel 4) and click **Next**.

    - **Select a system image:**

        - Choose a system image (e.g., `R` for Android 11) and click **Next**.

    - **Configure AVD:**
        - You can leave the settings as default or customize them according to your preference.
        - Click **Finish** to create the AVD.

4. **Start the Emulator:**

    - Open AVD Manager and click the **Play** button next to your newly created virtual device to start the emulator.

5. **Run the Project on the Emulator:**
    - Ensure your development server is running (`expo start`).
    - Press `a` in the terminal where the Expo CLI is running to open the project in the Android emulator.

### iOS Simulator

To set up an iOS simulator, you'll need Xcode installed. Follow these steps to create and configure an iOS simulator:

1. **Install Xcode:**

    - Download and install Xcode from the [Mac App Store](https://apps.apple.com/us/app/xcode/id497799835).

2. **Set Up Xcode Command Line Tools:**

    - Open Xcode and agree to the license agreement.
    - Install the necessary command line tools by running the following command in Terminal:

        ```sh
        xcode-select --install
        ```

3. **Open Xcode and Configure the iOS Simulator:**

    - **Start Xcode** and go to **Preferences** (Xcode menu > Preferences or `Cmd + ,`).

    - **Download iOS Simulator:**

        - In the Preferences window, go to the **Components** tab.
        - Here, you can download additional simulators for different iOS versions if needed.

4. **Create a New Simulator:**

    - Go to **Xcode** > **Open Developer Tool** > **Simulator**.

    - **Create a new simulator:**

        - In the Simulator window, go to **File** > **New Simulator**.
        - Name your simulator (e.g., "iPhone 12 Pro"), select a device type (e.g., iPhone 12 Pro), and choose an iOS version.
        - Click **Create** to add the new simulator.

5. **Start the Simulator:**

    - Open **Simulator** (you can also do this from within Xcode by selecting `Hardware` > `Device` and choosing your new simulator).
    - Your selected simulator will start, displaying the iOS home screen.

6. **Run the Project on the Simulator:**

    - Ensure your development server is running (`expo start` or the relevant command for your project).
    - In Xcode, open your project (e.g., `.xcworkspace` file if using CocoaPods).
    - Select your simulator from the **Scheme** menu next to the play button in the toolbar.
    - Press the **Run** button (or `Cmd + R`) to build and run your project on the selected simulator.

## Using a Physical Device through USB

### A. For Android devices

1. **Enable Developer Options**

    - To enable Developer Options on your Android device, follow the specific instructions for your device. Generally, you can enable Developer Options by going to your device settings, navigating to the "About phone" section, and tapping the build number several times.

2. **Enable USB Debugging**

    - Once Developer Options are enabled, you can enable USB Debugging in the Developer Options settings.

3. **Allow Installation via USB**

    - Ensure that you allow app installations via USB on your Android device. This option can also be found in the Developer Options settings.

4. **Allow Access to Port 8081 in Linux Firewalls**
    - Ensure that your computer's firewall allows traffic on port 8081, which is used by the Expo development server.
    - To allow access to port 8081 in a Linux firewall, you can use the following command:
        ```sh
        sudo ufw allow 8081
        ```

### B. For iOS devices

1. **Enable Developer Mode**

    - To enable Developer Mode on your iOS device, go to Settings > Privacy & Security and scroll down to find the Developer Mode section. Toggle the switch to enable Developer Mode. You might need to restart your device after enabling this option.

2. **Trust Your Computer**

    - Connect your iOS device to your computer. You will see a prompt asking if you trust this computer. Select "Trust" and enter your device passcode if prompted. This will allow your device to communicate with your computer for development purposes.

3. **Set Up Command Line Tools**

    - Open Xcode, go to Preferences > Locations, and select the latest version of Xcode for the Command Line Tools option. This ensures that your development environment is properly configured.

4. **Allow Access to Port 8081 in macOS Firewalls**

    - Ensure that your computer's firewall allows traffic on port 8081, which is used by the Expo development server.
    - To allow access to port 8081 in the macOS firewall, follow these steps:
        1. Open System Preferences > Security & Privacy.
        2. Go to the Firewall tab and click the lock to make changes.
        3. Click on "Firewall Options" or "Firewall Settings".
        4. Add a new rule to allow incoming connections on port 8081.

### Running the App on the Device

1. **Connect the Device to the Computer**

    - Connect your device to your computer using a USB cable.

2. **Run the Project on the Device**
    - Start the development server:
    ```shell
      expo start
    ```
    - Press `a` (for Android) or `i` (for iOS) in the terminal where the Expo CLI is running.
    - Select the connected device from the list of available devices.
    - If prompted, allow USB debugging on the device.
    - If prompted, allow the installation of the Expo Go app on the device.
    - The app will be installed and opened automatically on the Android device.
    - If everything is set up correctly, you can interact with the app and see real-time updates as you develop.

## Using a Physical Device through WiFi

TBD

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

# Building the App

## iOS

### Description

This guide will walk you through the steps necessary to build your app for iOS using Expo. Follow the instructions below to set up your environment, authenticate with Apple, and complete the build process.

For more detailed information, you can refer to the official Expo documentation on [building your app for iOS](https://docs.expo.dev/distribution/building-standalone-apps/#building-for-ios).

### Setup Expo

1. **Prepare the Environment**:

    - Ensure you have Expo CLI installed. If not, install it using:
        ```bash
        npm install -g expo-cli
        ```

2. **Navigate to Your Project Directory**:

    - Change to your project's directory:
        ```bash
        cd /path/to/your/project
        ```

3. **Start the Build Process**:

    - Run the command to initiate the build process, specifying the desired build profile:
        ```bash
        eas build --profile testing
        ```
    - When prompted, select the platform (iOS in this case).

4. **Authenticate with Apple**:

    - Expo will prompt you to log in to your Apple Developer account. Enter your Apple ID when asked:
        ```plaintext
        Apple ID: ... your_email@domain.com
        ```
    - If required, Expo will ask for your password to restore a session or create a new one:
        ```plaintext
        Password: ...
        ```

5. **Register the Bundle Identifier**:

    - Expo will automatically register the bundle identifier if it is not already registered:
        ```plaintext
        Bundle identifier registered com.yourdomain.yourproject
        ```

6. **Synchronize Certificates**:

    - Expo will sync and update existing distribution certificates. If necessary, it will reuse existing certificates:
        ```plaintext
        Using distribution certificate with serial number 2DADFFD915B7BD6B34D5C02DBAB305CE
        ```

7. **Register Devices**:

    - Expo may ask if you want to register new devices. If you choose to register new devices, you will receive a link to install the development profile on your iOS devices:
        ```plaintext
        Open the following link on your iOS devices (or scan the QR code) and follow the instructions to install the development profile: https://expo.dev/register-device/14b450a7-60e2-4b71-a848-a41187988e67
        ```

8. **Configure Project Credentials**:

    - Expo will display the configured project credentials, including the distribution certificate and provisioning profile.

9. **Upload the Project**:

    - Expo will compress and upload your project files to EAS Build:
        ```plaintext
        Compressing project files and uploading to EAS Build.
        ```

10. **Monitor the Build**:

-   Follow the build progress in the terminal. A link to monitor the build online will also be provided:
    ```plaintext
    Track the build progress directly in the terminal, where detailed information about the build status will be displayed. If you want to access further details, a unique identifier will be provided, which can be used to monitor the progress online.
    ```

11. **Complete the Build**:

-   Once the build is complete, Expo will provide a link or QR code to install the app on iOS devices:
    ```plaintext
    Once the build is complete, you will receive a QR code or a link in the terminal, which can be used to install the app on iOS devices. Simply open the link in a browser or scan the code with your device.
    ```

> **Note:** If it is the first time you are building the app, you may need to create/add a existing `Apple Distribution Certificate` and `Provisioning Profile`. You can do this by following the [instructions provided by Expo.]()
