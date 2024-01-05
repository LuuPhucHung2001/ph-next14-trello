'use client';

import React, { ElementRef, useRef } from 'react';
import { toast } from 'sonner';
import { List } from '@prisma/client';

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { Button } from '@/components/ui/button';
import { MoreHorizontal, X } from 'lucide-react';
import { FormSubmit } from '@/components/form/form-submit';
import { Separator } from '@/components/ui/separator';
import { useAction } from '@/hooks/use-action';
import { deleteList } from '@/actions/delete-list';
import { copyList } from '@/actions/copy-list';

interface ListOptionsProps {
  data: List;
  onAddCard: () => void;
}

const ListOptions = ({ data, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<'button'>>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess(data) {
      toast.success(`List ${data.title} deleted`);
      closeRef.current?.click();
    },
    onError(error) {
      toast.error(error);
    },
  });
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess(data) {
      toast.success(`List ${data.title} copied`);
      closeRef.current?.click();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onDelete = (formData: FormData) => {
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;

    executeDelete({
      id,
      boardId,
    });
  };
  const onCopy = (formData: FormData) => {
    const id = formData.get('id') as string;
    const boardId = formData.get('boardId') as string;

    executeCopy({
      id,
      boardId,
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant={'ghost'}>
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>
        <PopoverClose ref={closeRef}>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          variant="ghost"
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
        >
          Add card...
        </Button>
        <form className="" action={onCopy}>
          <input type="text" id="id" name="id" value={data.id} hidden />
          <input
            type="text"
            id="boardId"
            name="boardId"
            value={data.boardId}
            hidden
          />
          <FormSubmit
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            Copy list...
          </FormSubmit>
        </form>
        <Separator />
        <form className="" action={onDelete}>
          <input type="text" id="id" name="id" value={data.id} hidden />
          <input
            type="text"
            id="boardId"
            name="boardId"
            value={data.boardId}
            hidden
          />
          <FormSubmit
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ListOptions;
