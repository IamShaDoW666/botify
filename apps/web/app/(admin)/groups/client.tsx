"use client";

import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Contact, ContactGroup } from "@repo/db";
import { deleteContactGroup } from "@/actions/contact";
import Link from "next/link";
type Group = {
  _count: {
    contacts: number;
  };
} & ContactGroup;
export default function ContactGroupsTable({ initialContacts }: { initialContacts: Group[] }) {
  const [contacts, setContacts] = useState<Group[]>(initialContacts);



  const handleEditContact = (contactId: string) => {
    alert(`Edit action for contact ID: ${contactId}`);
  };

  const handleDeleteContact = (contactId: string) => {
    if (confirm("Are you sure you want to delete this contact?")) {
      deleteContactGroup({ id: contactId })
      setContacts(contacts.filter(c => c.id !== contactId));
      console.log(`Deleting contact ID: ${contactId}`);
    }
  };

  return (
    <div className="border rounded-lg rounded-t-none">
      <Table>
        <TableHeader className="bg-secondary">
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Number of Contacts</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact, index) => (

            <TableRow key={contact.id}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{contact.name}</TableCell>
              <TableCell>{contact._count.contacts}</TableCell>
              <TableCell className="text-right">
                <Link href={`/groups/${contact.id}`} key={contact.id} legacyBehavior>
                  <Button variant={'link'}>View Contacts</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleEditContact(contact.id)}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div >
  );
}
