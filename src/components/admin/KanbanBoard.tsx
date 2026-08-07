import { useEffect, useMemo, useRef, useState } from 'react'
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
      data-col-id={id}
      className={cn(
        // mobile: coluna com margem lateral; desktop: largura fixa
        'snap-center shrink-0 rounded-2xl border flex flex-col transition-colors',
        'w-[min(100%,calc(100vw-2.75rem))] sm:w-[300px] md:w-[280px]',
        'max-h-[min(62dvh,calc(100dvh-16rem))] md:max-h-[calc(100dvh-12rem)]',
        isOver ? 'bg-brand-blue/10 border-brand-blue/40' : 'bg-soft border-line',
      )}
    >
      <div className="px-3.5 py-3 border-b border-line flex items-center justify-between gap-2 sticky top-0 bg-inherit rounded-t-2xl z-10">
        <h2 className="font-display font-bold text-[13px] sm:text-[14px] text-navy m-0 leading-tight">
          {label}
        </h2>
        <span className="text-[12px] font-bold text-muted bg-white rounded-full px-2 py-0.5 border border-line shrink-0">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain p-2.5 space-y-2 min-h-[100px]">
        {children}
      </div>
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
  const [activeCol, setActiveCol] = useState(columns[0]?.id ?? '')
  const scrollerRef = useRef<HTMLDivElement>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 10 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 8 },
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

  function scrollToColumn(colId: string) {
    setActiveCol(colId)
    const root = scrollerRef.current
    if (!root) return
    const el = root.querySelector(`[data-col-id="${colId}"]`) as HTMLElement | null
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }

  // sync pill com scroll horizontal
  useEffect(() => {
    const root = scrollerRef.current
    if (!root) return
    const onScroll = () => {
      const center = root.scrollLeft + root.clientWidth / 2
      let bestId = columns[0]?.id ?? ''
      let bestDist = Infinity
      root.querySelectorAll<HTMLElement>('[data-col-id]').forEach((el) => {
        const mid = el.offsetLeft + el.offsetWidth / 2
        const d = Math.abs(mid - center)
        if (d < bestDist) {
          bestDist = d
          bestId = el.dataset.colId ?? bestId
        }
      })
      setActiveCol(bestId)
    }
    root.addEventListener('scroll', onScroll, { passive: true })
    return () => root.removeEventListener('scroll', onScroll)
  }, [columns])

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
      {/* Pills de etapa — mobile first */}
      <div className="mb-3">
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-0.5 px-0.5">
          {columns.map((col) => {
            const count = byStatus[col.id]?.length ?? 0
            const on = activeCol === col.id
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => scrollToColumn(col.id)}
                className={cn(
                  'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[12px] font-semibold border cursor-pointer transition-colors min-h-[40px]',
                  on
                    ? 'bg-navy text-white border-navy'
                    : 'bg-white text-navy/80 border-line hover:border-navy/20',
                )}
              >
                <span className="max-w-[9.5rem] truncate">{col.label}</span>
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                    on ? 'bg-white/20 text-white' : 'bg-soft text-muted',
                  )}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>
        <p className="text-[11px] text-muted m-0 mt-2 md:hidden">
          Deslize as colunas · segure o card para arrastar · toque para abrir
        </p>
      </div>

      <div
        ref={scrollerRef}
        className={cn(
          // sem -mx: respeita a margem do shell (não estoura a borda)
          'flex gap-3 overflow-x-auto pb-2',
          'snap-x snap-mandatory md:snap-none',
          'scroll-pl-0 scroll-pr-0',
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:[scrollbar-width:thin] md:[&::-webkit-scrollbar]:block',
        )}
      >
        {columns.map((col) => (
          <DroppableColumn
            key={col.id}
            id={col.id}
            label={col.label}
            count={byStatus[col.id]?.length ?? 0}
            isOver={overColumnId === col.id}
          >
            {(byStatus[col.id]?.length ?? 0) === 0 && (
              <p className="text-[12px] text-muted text-center py-8 m-0 pointer-events-none">
                Nenhum item nesta etapa
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
                  className="w-full text-left rounded-xl bg-white border border-line p-3.5 shadow-sm hover:border-navy/20 hover:shadow-md transition-all outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/30 active:scale-[0.99]"
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
          <div className="w-[min(280px,80vw)] rounded-xl bg-white border border-brand-blue/30 p-3.5 shadow-xl ring-2 ring-brand-blue/20 cursor-grabbing">
            {renderCard(activeItem, { isDragging: true })}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
