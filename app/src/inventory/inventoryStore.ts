import { observable } from 'mobx';

import ApiService from 'src/services/apiService';
import { InventoryModel, Item, Slot } from './inventoryModel';

const enum ResponseStatus {
    Unset,
    OK = 200,
    NetworkError,
    NotFound = 404,
    Unauthorized = 401,
    ServerError = 500
}

class InventoryStore {
    @observable
    public inventory?: InventoryModel;

    @observable
    public isLoading: boolean = false;

    @observable
    public status: ResponseStatus = ResponseStatus.Unset;

    public reset(): void {
        this.inventory = undefined;
        this.isLoading = false;
        this.status = ResponseStatus.Unset;
    }

    public async fetchInventory(): Promise<void> {
        try {
            this.isLoading = true;
            const fetchData: Response = await ApiService.get('/inventory');
            const body: object = await fetchData.json();

            this.status = fetchData.status;

            if(this.status === ResponseStatus.OK) {
                this.inventory = InventoryModel.fromJson(body);
            }
        } catch(error) {
            this.status = ResponseStatus.NetworkError;
        }

        this.isLoading = false;
    }

    public getItemInSlot(slot: number): Item | undefined {
        return this.inventory!.slots.find(i => i.slotNumber === slot)!.item;
    }

    public getSlotWithIndex(index: number): Slot {
        return this.inventory!.slots[index];
    }

    public slotHasItem(slot: number): boolean {
        return this.getItemInSlot(slot) !== undefined;
    }
}

export default new InventoryStore();
