import { observable, computed } from "mobx";
import InventorySlot from './inventorySlot';

class DragManager {
    @observable isEnabled: boolean = false;

    @observable currentDraggingSlot?: InventorySlot = undefined;
    @observable lastDraggingSlot?: InventorySlot = undefined;

    @observable mouseOverSlot?: InventorySlot = undefined;
    @observable lastMouseOverSlot?: InventorySlot = undefined;

    @observable mouseOverSlotOriginalX?: number = undefined;
    @observable mouseOverSlotOriginalY?: number = undefined;

    @observable currentDraggingSlotOriginalX?: number = undefined;
    @observable currentDraggingSlotOriginalY?: number = undefined;
    
    @observable mouseOffsetOriginalX?: number = undefined;
    @observable mouseOffsetOriginalY?: number = undefined;

    @observable translateX?: number = undefined;
    @observable translateY?: number = undefined;

    @observable moveComplete: boolean = false;

    @computed get isDragging(): boolean {
        return this.currentDraggingSlot != undefined;
    }

    @computed get isHovering(): boolean {
        return this.mouseOverSlot != undefined;
    }

    public enableDragging(): void {
        this.isEnabled = true;
    }

    public disableDragging(): void {
        this.isEnabled = false;
    }

    reset(): void {
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