import * as React from 'react';
import { observer } from 'mobx-react';

import './inventory.css';
import InventoryStore from './inventoryStore';
import InventorySlot from './inventorySlot';

@observer
class Inventory extends React.Component {
    public componentDidMount() {
        InventoryStore.reset();
        InventoryStore.fetchInventory();
    }

    public render(): React.ReactNode {
        if(InventoryStore.isLoading) {
            return (
                <p><b>Loading...</b></p>
            );
        } else if(InventoryStore.inventory == null) {
            return (
                <p><b>Unauthorized</b></p>
            );
        } else {
            let slotNumber: number = 0;
            return (
                <div className="inventoryContainer">
                    { 
                        InventoryStore.inventory.items.map(item => {
                            return (
                                <InventorySlot slotNumber={ slotNumber++ } />
                            );
                        }) 
                    }
                </div>
            )
        }
    }
}

export default Inventory;