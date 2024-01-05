'use client';

import { useCardModal } from '@/hooks/use-card-modal';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface CardItemProps {
  index: number;
  data: any;
}
import React from 'react';

const CardItem = ({ index, data }: CardItemProps) => {
  const cardModal = useCardModal();
  const id = useCardModal((state) => state.id);

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role="button"
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate border-2 border-transparent 
          hover:border-black cursor-pointer py-2 px-3 text-sm bg-white rounded-md shadow-sm"
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};

export default CardItem;
