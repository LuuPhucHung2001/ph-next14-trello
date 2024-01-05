import { Button } from '@/components/ui/button';
import Logo from '@/components/logo';
import { OrganizationSwitcher } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import { Plus } from 'lucide-react';
import React from 'react';
import MobileSidebar from './mobile-sidebar';
import FormPopover from '@/components/form/form-popover';

const Navbar = () => {
  return (
    <nav
      className="fixed top-0 z-50 px-4 w-full h-14 border-b shadow-sm first-letter:
  bg-white flex items-center"
    >
      <MobileSidebar />
      <div className="flex items-center gap-x-4">
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover align="start" side="bottom" sideOffset={20}>
          <Button
            size="sm"
            variant="primary"
            className="rounded-sm hidden md:block h-auto py-1.5 px-2"
          >
            Create
          </Button>
        </FormPopover>
        <FormPopover>
          <Button className="rounded-sm block md:hidden" variant="primary">
            <Plus className="w-4 h-4" />
          </Button>
        </FormPopover>
      </div>
      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              },
            },
          }}
        />
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              avatarBox: {
                height: 30,
                width: 30,
              },
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Navbar;
