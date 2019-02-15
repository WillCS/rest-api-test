import * as React from 'react';
import './inventorySlot.css';
import Item from './item';
import { observer } from 'mobx-react';
import InventoryStore from './inventoryStore';
import inventoryStore from './inventoryStore';

interface InventorySlotProps {
    itemIndex: number;
}

@observer
class InventorySlot extends React.Component<InventorySlotProps, {}> {
    constructor(props: InventorySlotProps) {
        super(props);

        this.handleBeginDragging = this.handleBeginDragging.bind(this);
        this.handleDragging = this.handleDragging.bind(this);
        this.handleFinishDragging = this.handleFinishDragging.bind(this);

        this.handleMouseEnter = this.handleMouseEnter.bind(this);
    }

    private handleBeginDragging(event: React.MouseEvent): void {
        InventoryStore.moveComplete = false;

        const rect: ClientRect | DOMRect = event.currentTarget.getBoundingClientRect();
        const absoluteX = rect.left;
        const absoluteY = rect.top;

        InventoryStore.currentDraggingSlot = this;
        InventoryStore.lastDraggingSlot = this;
        
        InventoryStore.originalMouseOffsetX = event.pageX - absoluteX;
        InventoryStore.originalMouseOffsetY = event.pageY - absoluteY;

        InventoryStore.originalX = absoluteX + InventoryStore.originalMouseOffsetX;
        InventoryStore.originalY = absoluteY + InventoryStore.originalMouseOffsetY;

        window.addEventListener('mousemove', this.handleDragging);
        window.addEventListener('mouseup', this.handleFinishDragging);
    }

    private handleDragging(event: MouseEvent): void {
        if(InventoryStore.mouseOverSlot == this) {
            InventoryStore.mouseOverSlot = undefined;
        } 
        
        InventoryStore.translateX = event.pageX - InventoryStore.originalX!;
        InventoryStore.translateY = event.pageY - InventoryStore.originalY!;
    }

    private handleFinishDragging(event: MouseEvent): void {
        window.removeEventListener('mousemove', this.handleDragging);
        window.removeEventListener('mouseup', this.handleFinishDragging);

        if(InventoryStore.mouseOverSlot != this && inventoryStore.mouseOverSlot != undefined) {
            const mouseOverSlot = InventoryStore.mouseOverSlot!;
            const mySlot: number = InventoryStore.inventory!.items[this.props.itemIndex].slot;
            const otherSlot: number = InventoryStore.inventory!.items[mouseOverSlot.props.itemIndex].slot;
            
            InventoryStore.inventory!.items[this.props.itemIndex].slot = otherSlot;
            InventoryStore.inventory!.items[mouseOverSlot.props.itemIndex].slot = mySlot;
            InventoryStore.moveComplete = true;
        }

        InventoryStore.currentDraggingSlot = undefined;
        InventoryStore.originalX = undefined;
        InventoryStore.originalY = undefined;
        InventoryStore.translateX = undefined;
        InventoryStore.translateY = undefined;
        InventoryStore.originalMouseOffsetX = undefined;
        InventoryStore.originalMouseOffsetY = undefined;
    }

    private handleMouseEnter(event: React.MouseEvent) {
        if(InventoryStore.currentDraggingSlot != this && InventoryStore.lastMouseOverSlot != this) {
            const rect: ClientRect | DOMRect = event.currentTarget.getBoundingClientRect();
            const absoluteX = rect.left;
            const absoluteY = rect.top;

            InventoryStore.mouseOverSlot = this;
            InventoryStore.lastMouseOverSlot = this;
            InventoryStore.mouseOverSlotX = absoluteX;
            InventoryStore.mouseOverSlotY = absoluteY;
        } else if(InventoryStore.lastMouseOverSlot != this) {
            InventoryStore.mouseOverSlot = undefined;
            InventoryStore.lastMouseOverSlot = undefined;
            InventoryStore.mouseOverSlotX = undefined;
            InventoryStore.mouseOverSlotY = undefined;
        }
    }

    public render(): React.ReactNode {
        const dragging: boolean = InventoryStore.currentDraggingSlot != undefined;
        const draggingMe: boolean = InventoryStore.currentDraggingSlot == this;

        let translateX: number = draggingMe ? InventoryStore.translateX! : 0;
        let translateY: number = draggingMe ? InventoryStore.translateY! : 0;

        if(draggingMe) {
            translateX = InventoryStore.translateX!;
            translateY = InventoryStore.translateY!;
        }

        if(dragging && !draggingMe && InventoryStore.mouseOverSlot == this) {
            translateX = InventoryStore.originalX!
                - InventoryStore.originalMouseOffsetX!
                - InventoryStore.mouseOverSlotX!;
            translateY = InventoryStore.originalY!
                - InventoryStore.originalMouseOffsetY!
                - InventoryStore.mouseOverSlotY!;
        }

        if(!dragging && InventoryStore.lastDraggingSlot == this && inventoryStore.lastMouseOverSlot != undefined) {
            translateX = 0;
            translateY = 0;
        }

        if(!dragging && InventoryStore.lastMouseOverSlot == this && inventoryStore.lastDraggingSlot != undefined) {
            translateX = 0;
            translateY = 0;
        }

        const innerClasses: [string] = [
            'inventorySlot'
        ];

        const outerClasses: [string] = [
            'inventorySlotContainer'
        ];

        if(InventoryStore.moveComplete) {
            innerClasses.push('justMoved');
        }

        if(draggingMe) {
            innerClasses.push('dragging');
        }

        if(InventoryStore.mouseOverSlot == this) {
            innerClasses.push('hoveringOverItem');
            outerClasses.push('hoveringOverItemContainer');
        }

        if(InventoryStore.lastMouseOverSlot == this) {
            outerClasses.push('lastHoveringOverItemContainer');
        }

        if(InventoryStore.lastDraggingSlot == this) {
            outerClasses.push('lastDragged');
        }

        const innerStyle = {
            transform: `translate(${translateX}px, ${translateY}px)`
        };

        const outerStyle = {
            order: InventoryStore.inventory!.items[this.props.itemIndex].slot
        }

        return (
            <div 
            className={ outerClasses.join(' ') }
            style={ outerStyle as React.CSSProperties }
            onMouseEnter={ this.handleMouseEnter }>
                <div 
                    className={ innerClasses.join(' ') }
                    onMouseDown={ this.handleBeginDragging }
                    onMouseEnter={ this.handleMouseEnter }
                    style={ innerStyle as React.CSSProperties }
                >
                    <Item slotNumber={ this.props.itemIndex }/>
                </div>
            </div>
        );
    }
}

export default InventorySlot;