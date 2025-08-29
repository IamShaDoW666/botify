import { Suspense } from "react";
import ContactGroupsTable from "./client";
import { TableSkeleton } from "./table-skeleton";
import { prisma } from "@repo/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AddGroupDialog from "./add-group-dialog";
import ImportContactsDialog from "./import-contacts-dialog";
const ContactsPage = () => {
  return (
    <div className="container mx-auto py-10">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Contacts 👥</h1>
        <div className="flex items-center gap-2">
          <ImportContactsDialog />
          <AddGroupDialog />
        </div>
      </header>
      <Suspense fallback={<TableSkeleton />}>
        <ContactsServerComponent />
      </Suspense>
    </div >
  )
}

const ContactsServerComponent = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  const contactGroups = await prisma.contactGroup.findMany({
    where: {
      userId: session?.user.id
    },
    include: {
      _count: {
        select: {
          contacts: true
        }
      }
    }
  })
  return (
    <ContactGroupsTable initialContacts={contactGroups} />)
}


export default ContactsPage;
