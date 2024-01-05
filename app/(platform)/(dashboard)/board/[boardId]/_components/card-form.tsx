import { createCard } from '@/actions/create-card';
import { FormSubmit } from '@/components/form/form-submit';
import FormTextarea from '@/components/form/form-textarea';
import { Button } from '@/components/ui/button';
import { useAction } from '@/hooks/use-action';
import { Plus, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import React, {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  useRef,
} from 'react';
import { toast } from 'sonner';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<'form'>>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess(data) {
        toast.success(`Card "${data.title}" created`);
        disableEditing();
      },
      onError(error) {
        toast.error(error);
      },
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        disableEditing();
      }
    };

    useOnClickOutside(formRef, disableEditing);

    useEventListener('keydown', onKeyDown);

    const onTextareaKeydown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get('title') as string;
      const listId = formData.get('listId') as string;
      const boardId = params.boardId as string;

      console.log({ title, boardId, listId });

      execute({
        title,
        boardId,
        listId,
      });
    };

    if (isEditing) {
      return (
        <form
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
          ref={formRef}
        >
          <FormTextarea
            ref={ref}
            id="title"
            onKeyDown={onTextareaKeydown}
            placeholder="Enter a title for this card"
            errors={fieldErrors}
          />
          <input type="text" hidden id="listId" name="listId" value={listId} />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add card</FormSubmit>
            <Button
              className=""
              variant="ghost"
              size={'sm'}
              onClick={disableEditing}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="px-2 pt-2">
        <Button
          variant="ghost"
          onClick={enableEditing}
          className="h-auto w-full px-2 py-1.5 justify-start text-muted-foreground text-sm"
          size={'sm'}
        >
          <Plus className="w-4 h-4 mr-2" /> Add a card
        </Button>
      </div>
    );
  }
);
CardForm.displayName = 'CardForm';
export default CardForm;
