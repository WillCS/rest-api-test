export interface Slot {
    slotNumber: number;
    item?: Item;
}

export interface Item {
    name: string;
    rarity: number;
}

export class InventoryModel {
    public numSlots: number;
    public slots: Slot[];

    public static fromJson(json: any): InventoryModel {
        const inventory = new InventoryModel();
        console.log(inventory);
        inventory.numSlots = json.numSlots;
        inventory.slots = json.slots;

        return inventory;
    }
}