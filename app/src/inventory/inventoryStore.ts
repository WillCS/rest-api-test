import { observable } from "mobx";
import ApiService from 'src/services/apiService';
import InventoryModel from './inventoryModel';
import InventorySlot from './inventorySlot';

const enum ResponseStatus {
    Unset,
    OK = 200,
    NetworkError,
    NotFound = 404,
    Unauthorized = 401,
    ServerError = 500
}

class InventoryStore {
    @observable inventory?: InventoryModel;
    @observable isLoading: boolean = false;
    @observable status: ResponseStatus = ResponseStatus.Unset;
    
    // Facilitate drag and drop
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
        this.inventory = undefined;
        this.isLoading = false;
        this.status = ResponseStatus.Unset;

        this.currentDraggingSlot = undefined;
        this.lastDraggingSlot = undefined;
        this.mouseOverSlot = undefined;
        this.originalX = undefined;
        this.originalY = undefined;
        this.translateX = undefined;
        this.translateY= undefined;
        this.moveComplete = false;
    }

    async fetchInventory(): Promise<void> {
        try {
            this.isLoading = true;
            const fetchData: Response = await ApiService.get("/inventory")
            const body: object = await fetchData.json();
            
            this.status = fetchData.status;
            
            if(this.status == ResponseStatus.OK) {
                this.inventory = InventoryModel.fromJson(body);
            }
        } catch(error) {
            this.status = ResponseStatus.NetworkError;
        }

        this.isLoading = false;
    }
}

export default new InventoryStore();