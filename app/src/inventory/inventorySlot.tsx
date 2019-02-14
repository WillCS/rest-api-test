import * as React from 'react';
import './inventorySlot.css';
import Item from './item';
import { observer } from 'mobx-react';
import InventoryStore from './inventoryStore';

interface InventorySlotProps {
    slotNumber: number;
}

@observer
class InventorySlot extends React.Component<InventorySlotProps, {}> {
    constructor(props: InventorySlotProps) {
        super(props);

        this.handleBeginDragging = this.handleBeginDragging.bind(this);
        this.handleDragging = this.handleDragging.bind(this);
        this.handleFinishDragging = this.handleFinishDragging.bind(this);
    }

    private handleBeginDragging(event: React.MouseEvent): void {
        event.preventDefault();

        const rect: ClientRect | DOMRect = event.currentTarget.getBoundingClientRect();
        const absoluteX = rect.left;
        const absoluteY = rect.top;

        InventoryStore.currentDraggingSlot = this;
        InventoryStore.originalX = absoluteX;
        InventoryStore.originalY = absoluteY;

        window.addEventListener('mousemove', this.handleDragging);
        window.addEventListener('mouseup', this.handleFinishDragging);
    }

    private handleDragging(event: MouseEvent): void {
        
    }

    private handleFinishDragging(event: MouseEvent): void {
        window.removeEventListener('mousemove', this.handleDragging);
        window.removeEventListener('mouseup', this.handleFinishDragging);

        InventoryStore.currentDraggingSlot = undefined;
        InventoryStore.originalX = undefined;
        InventoryStore.originalY = undefined;
    }

    public render(): React.ReactNode {
        return (
            <div 
                className="inventorySlot" 
                onMouseDown={this.handleBeginDragging}
            >
                <Item slotNumber={ this.props.slotNumber }/>
            </div>
        );
    }
}

export default InventorySlot;