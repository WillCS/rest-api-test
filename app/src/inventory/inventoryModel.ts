interface Slot {
    slotNumber: number;
    item?: Item;
}

interface Item {
    name: string;
}

class InventoryModel {
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

export default InventoryModel;