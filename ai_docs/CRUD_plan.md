# CRUD Implementation Plan for Campaigns

This document outlines the plan to implement Create, Read, Update, and Delete (CRUD) functionality for the campaigns table.

## 1. Create

- The "Create Campaign" button already exists and links to the `/campaigns/new` page.
- The form on this page uses a server action `createCampaign` to create a new campaign.
- **TODO:** Verify that the `createCampaign` server action works as expected and provides user feedback (e.g., success/error toasts).

## 2. Read

- Campaigns are already being fetched and displayed in the data table.
- **TODO:** Implement a "View" action in the table's row actions dropdown.
- This action will navigate to a new page: `/campaigns/[campaignId]`.
- This page will display the details of the selected campaign.

## 3. Update

- **TODO:** Add an "Edit" action to the row actions dropdown.
- This action will navigate to a new page: `/campaigns/[campaignId]/edit`.
- This page will contain a form pre-filled with the campaign's data.
- **TODO:** Create an `updateCampaign` server action to handle the form submission and update the campaign in the database.

## 4. Delete

- **TODO:** Add a "Delete" action to the row actions dropdown.
- This action will trigger a confirmation dialog to prevent accidental deletions.
- **TODO:** Create a `deleteCampaign` server action that will be called upon confirmation to delete the campaign from the database.
