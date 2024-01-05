'use client';
import { ListWithCards } from '@/types';
import ListForm from './list-form';
import { useEffect, useState } from 'react';
import ListItem from './list-item';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useAction } from '@/hooks/use-action';
import { updateListOrder } from '@/actions/update-list-order';
import { toast } from 'sonner';
import { updateCardOrder } from '@/actions/update-card-order';

interface ListContainerProps {
  data: ListWithCards[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess(data) {
      toast.success(`List reordered`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess(data) {
      toast.success(`Card reordered`);
    },
    onError(error) {
      toast.error(error);
    },
  });

  const [orderedData, setOrderedData] = useState(data);

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }
    // dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // user moves  a list
    if (type === 'list') {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index })
      );
      setOrderedData(items);
      // TODO : trigger server action
      executeUpdateListOrder({ items, boardId });

      // user moves a card
    }
    if (type === 'card') {
      let newOrderedData = [...orderedData];

      // Source and destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) {
        return;
      }

      // check if cards exists on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      // check if cards exists on the desList

      if (!destination.cards) {
        destination.cards = [];
      }

      // moving the card in the same list

      if (source.droppableId === destination.droppableId) {
        const reorderCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderCards.forEach((card, index) => {
          card.order = index;
        });

        sourceList.cards = reorderCards;

        setOrderedData(newOrderedData);

        // Todo: Trigger server action
        executeUpdateCardOrder({ items: reorderCards, boardId });
        // user moves the card to another list
      } else {
        // remove card from the source list
        const [movedCard] = sourceList.cards.splice(source.index, 1);
        // Assign the card to the destination

        movedCard.listId = destination.droppableId;

        // add card to the destination list
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        // update the order for each card in the destination list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        setOrderedData(newOrderedData);

        executeUpdateCardOrder({
          boardId,
          items: destList.cards,
        });

        // Todo; trigger server action
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedData.map((list, index) => {
              return <ListItem key={list.id} index={index} data={list} />;
            })}
            {provided.placeholder}
            <ListForm />
            <div className="flex shrink-0 w-1"></div>
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ListContainer;
