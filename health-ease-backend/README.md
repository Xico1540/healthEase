# healthEase - Backend

This is the backend service for **healthEase**, a project developed in **.NET 8.0** aimed at providing home healthcare services. This repository contains the backend code and the necessary information to set up the development environment.

## Prerequisites

Before starting, ensure you have the following prerequisites installed:

- [.NET SDK 8.0](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Docker Compose](https://docs.docker.com/compose/) (optional for starting a database instance)
- [PostgreSQL](https://www.postgresql.org/) (or use the database instance via Docker)
- (Optional) [Rider IDE](https://www.jetbrains.com/rider/) or [Visual Studio](https://visualstudio.microsoft.com/)

## Initial Setup

To run the backend, you will need a **PostgreSQL** instance running on `localhost:5432`. The quickest way to set up a development environment is by using **Docker Compose**.

### Starting the Development Environment

You can start a minimal PostgreSQL instance for development using Docker Compose with the following commands, depending on your operating system:

**Windows:**
```
docker-compose -f ../dev/docker-compose.yml up -d
```

**Linux/MacOS:**
```
docker compose -f ../dev/docker-compose.yml up -d
```

This command will bring up the necessary containers for the development environment, such as the PostgreSQL database.

> **Note:** Ensure Docker and Docker Compose are correctly installed on your system.

## Running the Project in Rider IDE

If you are using **Rider IDE** by JetBrains, you will need to manually install the .NET SDK and runtime.

Some commands that are typically executed in **Visual Studio's Package Manager Console** need to be run manually in the terminal, as Rider does not provide direct support for the Package Manager Console.

### Useful Commands for Migrations and Database Updates

To ensure the application works correctly, you'll need to run Entity Framework (EF Core) commands to generate and apply database migrations.

#### Generate Migrations

This command creates migration files based on the changes made to the data model:

```sh
dotnet ef migrations add <migration_name>
```

Replace `<migration_name>` with a descriptive name for the migration.

#### Update the Database

After generating the migrations, you need to apply them to the database:

```sh
dotnet ef database update
```

> **Important:** Ensure the PostgreSQL instance is running before applying migrations.

### Installing NuGet Packages

If you need to add additional packages to the project, you can do so with the following command:

```sh
dotnet add package <package_name>
```

Replace `<package_name>` with the name of the package you wish to install.

## Running Tests

The project includes a set of unit tests to ensure that the core functionalities are working correctly. The tests are located in a separate project: `~/healthEase-api.Tests`.

### Running tests from the main project directory

To run the tests from the main project directory (`healthEase-api`), you can use the following command, which specifies the test project path:

```
dotnet test ../healthEase-api.Tests
```

This command allows you to run the tests without needing to navigate away from the main project directory.

### Running Tests with a Report

In addition to running the tests, you can also generate a detailed test report by using the following command:

```
dotnet msbuild -target:RunTestsAndGenerateReport ../healthEase-api.Tests
```

This command will execute the tests and generate a test report in a specific format, which can be helpful for tracking test results and analyzing any failures. The report will typically include information such as:
- Test execution summary (passed, failed, and skipped tests).
- Detailed logs for failed tests.
- Time taken for each test.

Make sure that the `RunTestsAndGenerateReport` target is correctly configured in your MSBuild or CI pipeline to produce the desired report format (e.g., HTML, XML).

### Running Tests in the IDE

You can also run the tests directly from your IDE (such as **Rider** or **Visual Studio**). Both IDEs provide integrated testing tools that allow you to:
- Run all tests with a single click.
- View detailed test results, including which tests passed or failed.
- Debug individual tests if needed.

In **Rider**, you can access the tests by right-clicking the `healthEase-api.Tests` project and selecting "Run Unit Tests." Alternatively, you can choose a specific test file and run all the tests in that file, or execute individual tests as needed.

Similarly, in **Visual Studio**, you can run the tests via the "Test Explorer."

### Test Results

The output will show the number of tests passed, failed, and skipped, along with the execution time for each test. When generating a test report, the detailed results will be saved in the specified format and location.

## Docker Compose Environment

The Docker Compose file is designed to simplify the creation of a development environment for the application. It currently includes a PostgreSQL database instance, which serves as the primary database for the application.

Additionally, there is a database restorer service that is responsible for restoring the database from a backup file.

Another service available is the database exporter, which is used to export the current state of the database for the purpose of creating a new backup.

### Existing Data in the Database

At present, the database contains the following data:

#### FHIR Resources:
- Patients
- Practitioners
- Schedules associated with Practitioners
- Slots associated with the Schedules

#### Users:
- There are registered users corresponding to various roles in the application: 
  - **Patient** (Role 0), 
  - **Practitioner** (Role 1), 
  - **Admin** (Role 2).


- The registered email addresses can be retrieved via our [Postman collection](https://app.getpostman.com/join-team?invite_code=485914de67ed3f2bb145bf3e88702d82&target_code=a045ffb799135974358608ceb629e299) or through [Swagger](http://localhost:5127/swagger/index.html) by accessing the `/users` **GET** endpoint. 
- **Note**: This endpoint should only be accessed by **administrators**, requiring a login with **administrator credentials**, which are provided below.


- The default **credentials** for admin user are as follows:
    - **Admin**:
        - email: `admin@healthEase.com `
        - password: `test-admin`


- The default **passwords** for patient and practitioners are as follows:
    - **Patient**: `test-user`
    - **Practitioner**: `test-practitioner`
