import cn from 'classnames';
import { ExportDialog } from './components/ExportDialog';
import { RenameDialog } from './components/RenameDialog';
import { BitmapView } from './components/BitmapView';
import { GridDialog } from './components/GridDialog';
import { BitmapSizeAlert } from '../BitmapSizeAlert';
import { ResizeDialog } from './components/ResizeDialog';
import { useToolbar } from './hooks/useToolbar';
import { Dialog, useDialog } from './hooks/useDialog';
import { useBitmap } from './hooks/useBitmap';

interface BitmapEditorProps {
  bitmapId: string;
}

export const BitmapEditor = ({ bitmapId }: BitmapEditorProps): JSX.Element => {
  const dialog = useDialog();
  const { bitmapEntity, bitmap, updateBitmap } = useBitmap(bitmapId);
  const { buttons, selectedArea, selectedAreaOnly, onSelectArea, onChangeBitmap, onChangeBitmapDebounce } = useToolbar({
    bitmap,
    updateBitmap,
  });

  return (
    <>
      <div className="d-flex flex-column align-items-center">
        <h3 className="mb-3 d-flex gap-2">
          {bitmapEntity.name} ({bitmapEntity.width}x{bitmapEntity.height})
          <button className="btn btn-outline-primary" aria-label="Rename" onClick={dialog.openRenameDialog}>
            <i className="bi bi-pencil-square" /> Rename
          </button>
        </h3>
        <div className="d-flex gap-3 mb-3 text-black-50">
          <div className="d-flex gap-2">
            <i className="bi bi-brush" />
            Draw: Ctrl + Mouse key
          </div>
          <div className="d-flex gap-2">
            <i className="bi bi-arrows-move" />
            Move: Up / Down / Left / Right
          </div>
        </div>
        <div className="mb-3 d-flex gap-2">
          <div className="btn-group">
            <button
              className={cn('btn btn-outline-primary', buttons.draw.active && 'active')}
              onClick={buttons.draw.onClick}
              disabled={buttons.draw.disabled}
              title="Ctr+U / Cmd+U">
              <i className="bi bi-brush" /> Draw
            </button>
            <button
              className={cn('btn btn-outline-primary', buttons.clear.active && 'active')}
              onClick={buttons.clear.onClick}
              disabled={buttons.clear.disabled}
              title="Ctr+I / Cmd+I">
              <i className="bi bi-eraser" /> Clear
            </button>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={buttons.undo.onClick}
            disabled={buttons.undo.disabled}
            title="Ctr+Z / Cmd+Z">
            <i className="bi bi-arrow-counterclockwise" /> Undo
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={buttons.redo.onClick}
            disabled={buttons.redo.disabled}
            title="Ctr+Shift+Z / Cmd+Shift+Z">
            <i className="bi bi-arrow-clockwise" /> Redo
          </button>
          <button
            className={cn('btn', buttons.area.active ? 'btn-primary' : 'btn-outline-primary')}
            onClick={buttons.area.onClick}
            disabled={buttons.area.disabled}>
            <i className="bi bi-bounding-box" /> Area
          </button>
          <button
            className="btn btn-outline-primary"
            title="Invert color"
            onClick={buttons.invert.onClick}
            disabled={buttons.invert.disabled}>
            <i className="bi bi-highlights" /> Invert
          </button>
          <button className="btn btn-outline-primary" onClick={buttons.reset.onClick} disabled={buttons.reset.disabled}>
            Reset
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={dialog.openExportDialog}
            disabled={buttons.export.disabled}>
            <i className="bi bi-code-slash" /> Export to C
          </button>
          <button className="btn btn-outline-primary" onClick={dialog.openGridDialog} disabled={buttons.grid.disabled}>
            <i className="bi bi-border-all" /> Grid
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={dialog.openLayoutDialog}
            disabled={buttons.resize.disabled}>
            <i className="bi bi-arrows-fullscreen" /> Resize
          </button>
        </div>
        <BitmapSizeAlert bitmapWidth={bitmapEntity.width} className="mb-3" />
        <BitmapView
          bitmap={bitmap}
          onChangeBitmap={onChangeBitmapDebounce}
          clearMode={buttons.clear.active}
          areaMode={buttons.area.active}
          selectedArea={selectedArea}
          onSelectArea={onSelectArea}
        />
      </div>
      {dialog.opened === Dialog.Export && (
        <ExportDialog onClose={dialog.close} bitmapId={bitmapId} area={selectedAreaOnly} />
      )}
      {dialog.opened === Dialog.Rename && <RenameDialog onClose={dialog.close} bitmapId={bitmapId} />}
      {dialog.opened === Dialog.Grid && <GridDialog onClose={dialog.close} />}
      {dialog.opened === Dialog.Resize && (
        <ResizeDialog bitmap={bitmap} onChangeBitmap={onChangeBitmap} onClose={dialog.close} />
      )}
    </>
  );
};
