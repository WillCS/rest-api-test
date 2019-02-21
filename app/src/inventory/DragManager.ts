import { computed, observable } from 'mobx';

import InventorySlot from './inventorySlot';

class DragManager {
    @observable
    public isEnabled: boolean = false;

    @observable
    public currentDraggingSlot?: InventorySlot = undefined;
    @observable
    public lastDraggingSlot?: InventorySlot = undefined;

    @observable
    public mouseOverSlot?: InventorySlot = undefined;
    @observable
    public lastMouseOverSlot?: InventorySlot = undefined;

    @observable
    public mouseOverSlotOriginalX?: number = undefined;
    @observable
    public mouseOverSlotOriginalY?: number = undefined;

    @observable
    public currentDraggingSlotOriginalX?: number = undefined;
    @observable
    public currentDraggingSlotOriginalY?: number = undefined;

    @observable
    public mouseOffsetOriginalX?: number = undefined;
    @observable
    public mouseOffsetOriginalY?: number = undefined;

    @observable
    public translateX?: number = undefined;
    @observable
    public translateY?: number = undefined;

    @observable
    public moveComplete: boolean = false;

    @computed get isDragging(): boolean {
        return this.currentDraggingSlot !== undefined;
    }

    @computed get isHovering(): boolean {
        return this.mouseOverSlot !== undefined;
    }

    public enableDragging(): void {
        this.isEnabled = true;
    }

    public disableDragging(): void {
        this.isEnabled = false;
    }

    public reset(): void {
        this.currentDraggingSlot = undefined;
        this.currentDraggingSlotOriginalX = undefined;
        this.currentDraggingSlotOriginalY = undefined;

        this.translateX = undefined;
        this.translateY= undefined;

        this.mouseOverSlot = undefined;
        this.mouseOverSlotOriginalX = undefined;
        this.mouseOverSlotOriginalY = undefined;

        this.lastMouseOverSlot = undefined;
        this.lastDraggingSlot = undefined;

        this.mouseOffsetOriginalX = undefined;
        this.mouseOffsetOriginalY = undefined;

        this.isEnabled = true;
        this.moveComplete = false;
    }
}

export default new DragManager();
