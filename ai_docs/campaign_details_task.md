# Task: Enhance Campaign Details Page

## Objective
Enhance the `apps/web/app/(admin)/campaigns/[campaignId]/page.tsx` to display comprehensive campaign details and a list of associated "Blasts" (messages).

## Current State
The page currently displays the campaign name, message, and creation date.

## Proposed Changes

1.  **Update Prisma Query:**
    *   Modify the `prisma.campaign.findUnique` query to include related `Message` records (assuming "Blasts" refer to `Message` records) and the associated `Group` (if a campaign is linked to a group).
    *   Determine the relationship between `Campaign` and `Group` by inspecting `packages/db/schema.prisma`.

2.  **Display Campaign Details:**
    *   Render the campaign name, group name (if applicable), and message.

3.  **Implement Blasts Table:**
    *   Create a neatly designed table to display all `Message` records associated with the campaign.
    *   Identify relevant fields from the `Message` model to display in the table (e.g., recipient, content, status, sent date).
    *   Utilize ShadCN UI components for the table (e.g., `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`) to maintain consistency with the project's frontend.

## Verification
*   Ensure the page loads correctly with all campaign details.
*   Verify that the table displays the correct "Blast" (message) data for the campaign.
*   Check for any console errors or UI inconsistencies.
