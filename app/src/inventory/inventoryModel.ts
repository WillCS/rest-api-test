interface Item {
    slot: number;
    item: string;
}

class InventoryModel {
    public slots: number;
    public items: Item[];

    public static fromJson(json: any): InventoryModel {
        const inventory = new InventoryModel();
        inventory.slots = json.slots;
        const items: string[] = json.items;

        inventory.items = [];

        for(let i = 0; i < inventory.slots; i++) {
            inventory.items.push({ slot: i, item: items[i] });
        }

        return inventory;
    }
}

export default InventoryModel;