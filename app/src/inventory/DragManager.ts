import { observable } from "mobx";
import InventorySlot from './inventorySlot';

class DragManager {
    @observable currentDraggingSlot?: InventorySlot = undefined;
    @observable lastDraggingSlot?: InventorySlot = undefined;

    @observable mouseOverSlot?: InventorySlot = undefined;
    @observable lastMouseOverSlot?: InventorySlot = undefined;

    @observable mouseOverSlotX?: number = undefined;
    @observable mouseOverSlotY?: number = undefined;

    @observable originalX?: number = undefined;
    @observable originalY?: number = undefined;
    
    @observable originalMouseOffsetX?: number = undefined;
    @observable originalMouseOffsetY?: number = undefined;

    @observable translateX?: number = undefined;
    @observable translateY?: number = undefined;

    @observable moveComplete: boolean = false;

    reset(): void {
        this.currentDraggingSlot = undefined;
        this.lastDraggingSlot = undefined;
        this.mouseOverSlot = undefined;
        this.lastMouseOverSlot = undefined;
        this.mouseOverSlotX = undefined;
        this.mouseOverSlotY = undefined;
        this.originalX = undefined;
        this.originalY = undefined;
        this.originalMouseOffsetX = undefined;
        this.originalMouseOffsetY = undefined;
        this.translateX = undefined;
        this.translateY= undefined;
        this.moveComplete = false;
    }
}

export default new DragManager();