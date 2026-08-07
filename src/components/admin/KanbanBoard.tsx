import { useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core'
import { cn } from '@/lib/utils'

export type KanbanColumnDef = {
  id: string
  label: string
}

type KanbanBoardProps<T extends { id: string; status: string }> = {
  columns: KanbanColumnDef[]
  items: T[]
  getStatus: (item: T) => string
  onMove: (id: string, newStatus: string) => Promise<void> | void
  onOpen: (item: T) => void
  renderCard: (item: T, opts: { isDragging?: boolean }) => React.ReactNode
  disabled?: boolean
}

function DroppableColumn({
  id,
  label,
  count,
  children,
  isOver,
}: {
  id: string
  label: string
  count: number
  children: React.ReactNode
  isOver: boolean
}) {
  const { setNodeRef } = useDroppable({ id })
  return (
    <div
      ref={setNodeRef}
      className={cn(
        'w-[280px] shrink-0 rounded-2xl border flex flex-col max-h-[calc(100dvh-200px)] transition-colors',
        isOver ? 'bg-brand-blue/10 border-brand-blue/40' : 'bg-soft border-line',
      )}
    >
      <div className="px-3.5 py-3 border-b border-line flex items-center justify-between gap-2 sticky top-0 bg-inherit rounded-t-2xl z-10">
        <h2 className="font-display font-bold text-[14px] text-navy m-0">{label}</h2>
        <span className="text-[12px] font-bold text-muted bg-white rounded-full px-2 py-0.5 border border-line">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 min-h-[120px]">{children}</div>
    </div>
  )
}

function DraggableCard({
  id,
  disabled,
  children,
}: {
  id: string
  disabled?: boolean
  children: React.ReactNode
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
    disabled,
  })
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'touch-none',
        isDragging && 'opacity-40',
        disabled ? 'cursor-default' : 'cursor-grab active:cursor-grabbing',
      )}
      {...listeners}
      {...attributes}
    >
      {children}
    </div>
  )
}

export function KanbanBoard<T extends { id: string; status: string }>({
  columns,
  items,
  getStatus,
  onMove,
  onOpen,
  renderCard,
  disabled,
}: KanbanBoardProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [overColumnId, setOverColumnId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // evita conflito com clique para abrir detalhe
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 180, tolerance: 6 },
    }),
  )

  const byStatus = useMemo(() => {
    const map = Object.fromEntries(columns.map((c) => [c.id, [] as T[]])) as Record<string, T[]>
    for (const item of items) {
      const key = getStatus(item)
      if (map[key]) map[key].push(item)
      else if (columns[0]) map[columns[0].id].push(item)
    }
    return map
  }, [columns, items, getStatus])

  const activeItem = activeId ? items.find((i) => i.id === activeId) ?? null : null
  const columnIds = useMemo(() => new Set(columns.map((c) => c.id)), [columns])

  function resolveColumnId(overId: string | undefined | null): string | null {
    if (!overId) return null
    if (columnIds.has(overId)) return overId
    const item = items.find((i) => i.id === overId)
    if (item) return getStatus(item)
    return null
  }

  function onDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id))
  }

  function onDragOver(event: DragOverEvent) {
    const col = resolveColumnId(event.over ? String(event.over.id) : null)
    setOverColumnId(col)
  }

  async function onDragEnd(event: DragEndEvent) {
    const id = String(event.active.id)
    const targetCol = resolveColumnId(event.over ? String(event.over.id) : null)
    setActiveId(null)
    setOverColumnId(null)
    if (!targetCol) return

    const item = items.find((i) => i.id === id)
    if (!item) return
    const current = getStatus(item)
    if (current === targetCol) return

    await onMove(id, targetCol)
  }

  function onDragCancel() {
    setActiveId(null)
    setOverColumnId(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={(e) => void onDragEnd(e)}
      onDragCancel={onDragCancel}
    >
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-1 px-1">
        {columns.map((col) => (
          <DroppableColumn
            key={col.id}
            id={col.id}
            label={col.label}
            count={byStatus[col.id]?.length ?? 0}
            isOver={overColumnId === col.id}
          >
            {(byStatus[col.id]?.length ?? 0) === 0 && (
              <p className="text-[12px] text-muted text-center py-6 m-0 pointer-events-none">
                Arraste cards para cá
              </p>
            )}
            {byStatus[col.id]?.map((item) => (
              <DraggableCard key={item.id} id={item.id} disabled={disabled}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    if (!activeId) onOpen(item)
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      onOpen(item)
                    }
                  }}
                  className="w-full text-left rounded-xl bg-white border border-line p-3 shadow-sm hover:border-navy/20 hover:shadow-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30"
                >
                  {renderCard(item, { isDragging: activeId === item.id })}
                </div>
              </DraggableCard>
            ))}
          </DroppableColumn>
        ))}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeItem ? (
          <div className="w-[260px] rounded-xl bg-white border border-brand-blue/30 p-3 shadow-xl ring-2 ring-brand-blue/20 cursor-grabbing">
            {renderCard(activeItem, { isDragging: true })}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
