import type Sortable from 'sortablejs'

interface SortableOptions {
  originalEvent: MouseEvent
}

type SortableEventOption = Sortable.MoveEvent & SortableOptions & Sortable.SortableEvent
