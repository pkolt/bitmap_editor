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
import { useTranslation } from 'react-i18next';

interface BitmapEditorProps {
  bitmapId: string;
}

export const BitmapEditor = ({ bitmapId }: BitmapEditorProps): JSX.Element => {
  const { t } = useTranslation();
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
          <button className="btn btn-outline-primary" aria-label={t('Rename')} onClick={dialog.openRenameDialog}>
            <i className="bi bi-pencil-square" /> {t('Rename')}
          </button>
        </h3>
        <div className="d-flex gap-3 mb-3 text-black-50">
          <div className="d-flex gap-2">
            <i className="bi bi-brush" />
            {t('Draw: Ctrl + Mouse key')}
          </div>
          <div className="d-flex gap-2">
            <i className="bi bi-arrows-move" />
            {t('Move: Up / Down / Left / Right')}
          </div>
        </div>
        <div className="mb-3 d-flex gap-2">
          <div className="btn-group">
            <button
              className={cn('btn btn-outline-primary', buttons.draw.active && 'active')}
              onClick={buttons.draw.onClick}
              disabled={buttons.draw.disabled}
              title="Ctr+U / Cmd+U">
              <i className="bi bi-brush" /> {t('Draw')}
            </button>
            <button
              className={cn('btn btn-outline-primary', buttons.clear.active && 'active')}
              onClick={buttons.clear.onClick}
              disabled={buttons.clear.disabled}
              title="Ctr+I / Cmd+I">
              <i className="bi bi-eraser" /> {t('Clear')}
            </button>
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={buttons.undo.onClick}
            disabled={buttons.undo.disabled}
            title="Ctr+Z / Cmd+Z">
            <i className="bi bi-arrow-counterclockwise" /> {t('Undo')}
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={buttons.redo.onClick}
            disabled={buttons.redo.disabled}
            title="Ctr+Shift+Z / Cmd+Shift+Z">
            <i className="bi bi-arrow-clockwise" /> {t('Redo')}
          </button>
          <button
            className={cn('btn', buttons.area.active ? 'btn-primary' : 'btn-outline-primary')}
            onClick={buttons.area.onClick}
            disabled={buttons.area.disabled}>
            <i className="bi bi-bounding-box" /> {t('Area')}
          </button>
          <button
            className="btn btn-outline-primary"
            title="Invert color"
            onClick={buttons.invert.onClick}
            disabled={buttons.invert.disabled}>
            <i className="bi bi-highlights" /> {t('Invert')}
          </button>
          <button className="btn btn-outline-primary" onClick={buttons.reset.onClick} disabled={buttons.reset.disabled}>
            {t('Reset')}
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={dialog.openExportDialog}
            disabled={buttons.export.disabled}>
            <i className="bi bi-code-slash" /> {t('Export to C')}
          </button>
          <button className="btn btn-outline-primary" onClick={dialog.openGridDialog} disabled={buttons.grid.disabled}>
            <i className="bi bi-border-all" /> {t('Grid')}
          </button>
          <button
            className="btn btn-outline-primary"
            onClick={dialog.openLayoutDialog}
            disabled={buttons.resize.disabled}>
            <i className="bi bi-arrows-fullscreen" /> {t('Resize')}
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
      <ExportDialog
        show={dialog.opened === Dialog.Export}
        onClose={dialog.close}
        bitmapId={bitmapId}
        area={selectedAreaOnly}
      />
      <RenameDialog show={dialog.opened === Dialog.Rename} onClose={dialog.close} bitmapId={bitmapId} />
      <GridDialog show={dialog.opened === Dialog.Grid} onClose={dialog.close} />
      <ResizeDialog
        show={dialog.opened === Dialog.Resize}
        bitmap={bitmap}
        onChangeBitmap={onChangeBitmap}
        onClose={dialog.close}
      />
    </>
  );
};
