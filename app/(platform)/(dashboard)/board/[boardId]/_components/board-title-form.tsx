'use client';

import { updateBoard } from '@/actions/update-board';
import { FormInput } from '@/components/form/form-input';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { Board } from '@prisma/client';
import React, { ElementRef, useRef, useState } from 'react';
import { toast } from 'sonner';
interface BoarTitleFormProps {
  data: Board;
}

const BoarTitleForm = ({ data }: BoarTitleFormProps) => {
  const { execute } = useAction(updateBoard, {
    onSuccess(data) {
      toast.success(`Board "${data.title}" updated!`);
      setTitle(data.title);
      disableEditing();
    },
    onError(error) {
      toast.error(error);
    },
  });
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);
  const formRef = useRef<ElementRef<'form'>>(null);
  const inputRef = useRef<ElementRef<'input'>>(null);
  const enableEditing = () => {
    // Todo: focus input
    setIsEditing(true);
    setTimeout(() => {
      inputRef?.current?.focus();
      inputRef?.current?.select();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get('title') as string;
    execute({
      title,
      id: data.id,
    });
  };

  if (isEditing) {
    return (
      <form
        action={onSubmit}
        className="flex items-center gap-x-2"
        ref={formRef}
      >
        <FormInput
          ref={inputRef}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
          id="title"
          onBlur={onBlur}
          defaultValue={title}
        />
      </form>
    );
  }

  return (
    <div>
      <Button
        onClick={enableEditing}
        variant="transparent"
        className="font-bold text-lg h-auto w-auto p-1 px-2"
      >
        {title}
      </Button>
    </div>
  );
};

export default BoarTitleForm;
