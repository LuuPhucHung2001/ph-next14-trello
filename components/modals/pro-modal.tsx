'use client';

import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProModal } from '@/hooks/use-pro-modal';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { stripeRedirect } from '@/actions/stripe-redirect';
import { toast } from 'sonner';

const ProModal = () => {
  const proModal = useProModal();

  const { execute, isLoading } = useAction(stripeRedirect, {
    onSuccess(data) {
      window.location.href = data;
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onClick = () => {
    execute({});
  };
  return (
    <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/hero.svg" alt="Hero" className="object-cover" fill />
        </div>
        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="text-xl font-semibold">
            Upgrade to Taskify Pro Today
          </h2>
          <p className="text-xs text-neutral-600 font-semibold">
            Explore the Taskify
          </p>
          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited boards</li>
              <li>Advanced checklists</li>
              <li>Admin and security features</li>
              <li>And more!</li>
            </ul>
          </div>
          <Button
            variant={'primary'}
            className="w-full"
            onClick={onClick}
            disabled={isLoading}
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProModal;
