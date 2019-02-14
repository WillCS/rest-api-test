class InventoryModel {
    public slots: number;
    public items: string[];

    public static fromJson(json: any): InventoryModel {
        const inventory = new InventoryModel();
        inventory.slots = json.slots;
        inventory.items = json.items;

        return inventory;
    }
}

export default InventoryModel;