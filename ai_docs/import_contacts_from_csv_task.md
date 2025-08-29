# Feature: Import Contacts from CSV

## User Story

As a user, I want to upload a CSV file containing contact information (name, phone number) to create a new contact group and import the contacts into it. This will allow me to quickly add multiple contacts at once without manual entry.

## Acceptance Criteria

-   A user can upload a CSV file through the web interface.
-   The CSV file must contain 'name' and 'phone' columns.
-   The user must provide a name for the new `ContactGroup` that will be created.
-   The application will parse the CSV and create a new `Contact` for each row.
-   Each new `Contact` will be associated with the newly created `ContactGroup`.
-   The user will receive feedback on the success or failure of the import.
-   Phone numbers should undergo basic validation.

## Technical Implementation Plan

### 1. Frontend (Next.js - `apps/web`)

-   **Create a new UI component:**
    -   This component will be responsible for the file upload and creation of the contact group. It could be a modal or a dedicated page.
    -   It will contain:
        -   A file input that accepts only `.csv` files.
        -   An input field for the `ContactGroup` name.
        -   A submit button.
-   **Client-side CSV Parsing:**
    -   Use a library like `papaparse` to parse the CSV file in the browser. This provides immediate feedback to the user and avoids sending a large file to the server.
    -   Validate the parsed data to ensure it contains `name` and `phone` headers.
-   **Data Preview (Optional but Recommended):**
    -   Display the first few rows of the parsed data to the user as a preview.
    -   Show how many contacts will be imported.
-   **Server Action Call:**
    -   On form submission, call a new server action `importContacts`.
    -   The action will be passed an object containing the `groupName` and the array of parsed `contacts`.

### 2. Backend (Server Action)

-   **Create a new Server Action:**
    -   Create a new file at `apps/web/actions/contact-import.ts`.
    -   Define an exported function `importContacts` that is marked with `"use server"`.
-   **Input Validation:**
    -   Use a validation library (like `zod`) to validate the incoming data.
    -   Ensure `groupName` is a non-empty string.
    -   Ensure `contacts` is an array of objects, each with a `name` (string) and `phone` (string).
-   **Database Transaction:**
    -   Use Prisma's transaction capabilities (`$transaction`) to ensure data integrity.
    -   The transaction will:
        1.  Create a new `ContactGroup` with the provided `name`.
        2.  Create all the `Contact` records from the CSV data, associating them with the new `ContactGroup`'s ID.
    -   If any part of the transaction fails, the entire operation should be rolled back.
-   **Authentication:**
    -   The server action must be protected to ensure only authenticated users can import contacts. This can be done by checking for a valid session at the beginning of the action.

### 3. Database (`packages/db`)

-   No schema changes are required. The existing `Contact` and `ContactGroup` models are sufficient.

## Error Handling

-   **Invalid File Type:** The frontend should prevent the upload of files other than `.csv`.
-   **Invalid CSV Headers:** The client-side parsing should check for the required `name` and `phone` columns.
-   **Invalid Phone Numbers:** Basic validation on the backend (e.g., checking for length or character types) should be performed within the server action.
-   **Database Errors:** The transaction will handle atomicity. The server action should catch any errors from Prisma and return an appropriate error response.

## Task Breakdown

1.  **Backend:** Create the `importContacts` server action in `apps/web/actions/contact-import.ts`.
2.  **Backend:** Implement the business logic within the action for creating the `ContactGroup` and `Contacts` in a transaction, including validation and error handling.
3.  **Frontend:** Create the file upload component and UI (e.g., a modal).
4.  **Frontend:** Add a CSV parsing library (`papaparse`) and implement client-side validation.
5.  **Integration:** Connect the frontend component to the `importContacts` server action.
6.  **Testing:** Manually test the end-to-end flow with valid and invalid CSV files.
