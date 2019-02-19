import * as React from 'react';
import { observer } from 'mobx-react';

import './inventory.css';
import InventoryStore from './inventoryStore';
import InventorySlot from './inventorySlot';
import DragManager from './DragManager';

@observer
class Inventory extends React.Component {
    public componentDidMount() {
        InventoryStore.reset();
        InventoryStore.fetchInventory();
        
        DragManager.reset();
    }

    private renderInventory(): React.ReactNode {
        const containerClasses: string[] = [
            'inventoryContainer'
        ]

        if(DragManager.isDragging) {
            containerClasses.push('dragging');
        } else if(DragManager.isHovering) {
            containerClasses.push('hovering');
        }

        let slotIndex: number = 0
        return (
            <div className="inventoryWrapper">
                <div className="inventoryBackground">
                    { 
                        Array.from(InventoryStore.inventory!.slots).map(slot => {
                            return (
                                <div className="inventorySlotBackground" />
                            );
                        }) 
                    }
                </div>
                <div className={ containerClasses.join(' ') }>
                    { 
                        Array.from(InventoryStore.inventory!.slots).map(slot => {
                            return (
                                <InventorySlot slotIndex={ slotIndex++ } />
                            );
                        }) 
                    }
                </div>
            </div>
        )
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
            return this.renderInventory();
        }
    }
}

export default Inventory;