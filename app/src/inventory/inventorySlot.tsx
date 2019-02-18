import * as React from 'react';
import './inventorySlot.css';
import { observer } from 'mobx-react';
import InventoryStore from './inventoryStore';
import DragManager from './DragManager';
import { setTimeout } from 'timers';

interface InventorySlotProps {
    slotIndex: number;
}

@observer
class InventorySlot extends React.Component<InventorySlotProps, {}> {
    constructor(props: InventorySlotProps) {
        super(props);

        this.handleBeginDraggingItem = this.handleBeginDraggingItem.bind(this);
        this.handleDragItem = this.handleDragItem.bind(this);
        this.handleFinishDraggingItem = this.handleFinishDraggingItem.bind(this);

        this.handleMouseEnterItem = this.handleMouseEnterItem.bind(this);
        this.handleMouseLeaveItem = this.handleMouseLeaveItem.bind(this);
        this.handleMouseLeaveItemSlot = this.handleMouseLeaveItemSlot.bind(this);
    }

    private handleBeginDraggingItem(event: React.MouseEvent): void {
        DragManager.moveComplete = false;

        const rect: ClientRect | DOMRect = event.currentTarget.getBoundingClientRect();
        const absoluteX = rect.left;
        const absoluteY = rect.top;

        DragManager.currentDraggingSlot = this;
        
        DragManager.originalMouseOffsetX = event.pageX - absoluteX;
        DragManager.originalMouseOffsetY = event.pageY - absoluteY;

        DragManager.originalX = absoluteX + DragManager.originalMouseOffsetX;
        DragManager.originalY = absoluteY + DragManager.originalMouseOffsetY;

        window.addEventListener('mousemove', this.handleDragItem);
        window.addEventListener('mouseup', this.handleFinishDraggingItem);
    }

    private handleDragItem(event: MouseEvent): void {
        if(DragManager.mouseOverSlot == this) {
            DragManager.mouseOverSlot = undefined;
        } 
        
        DragManager.translateX = event.pageX - DragManager.originalX!;
        DragManager.translateY = event.pageY - DragManager.originalY!;
    }

    private handleFinishDraggingItem(event: MouseEvent): void {
        window.removeEventListener('mousemove', this.handleDragItem);
        window.removeEventListener('mouseup', this.handleFinishDraggingItem);

        if(DragManager.mouseOverSlot != this && DragManager.mouseOverSlot != undefined) {
            const mouseOverSlot = DragManager.mouseOverSlot!;
            const mySlot: number = InventoryStore.inventory!.slots[this.props.slotIndex].slotNumber;
            const otherSlot: number = InventoryStore.inventory!.slots[mouseOverSlot.props.slotIndex].slotNumber;
            
            InventoryStore.inventory!.slots[this.props.slotIndex].slotNumber = otherSlot;
            InventoryStore.inventory!.slots[mouseOverSlot.props.slotIndex].slotNumber = mySlot;
            DragManager.moveComplete = true;

            setTimeout(() => {
                DragManager.moveComplete = false;
            }, 1);
        }

        DragManager.lastDraggingSlot = this;

        setTimeout(() => {
            DragManager.lastDraggingSlot = undefined;
        }, 200);

        DragManager.currentDraggingSlot = undefined;
        DragManager.originalX = undefined;
        DragManager.originalY = undefined;
        DragManager.translateX = undefined;
        DragManager.translateY = undefined;
        DragManager.originalMouseOffsetX = undefined;
        DragManager.originalMouseOffsetY = undefined;
    }

    private handleMouseEnterItem(event: React.MouseEvent) {
        if(DragManager.currentDraggingSlot != this && DragManager.lastMouseOverSlot != this) {
            const rect: ClientRect | DOMRect = event.currentTarget.getBoundingClientRect();
            const absoluteX = rect.left;
            const absoluteY = rect.top;

            console.log(`${event.pageX}, ${event.pageY}`);
            console.log(`${rect.left}, ${rect.top}`);

            DragManager.mouseOverSlot = this;
            DragManager.mouseOverSlotX = absoluteX;
            DragManager.mouseOverSlotY = absoluteY;
        } else if(DragManager.currentDraggingSlot == this && DragManager.lastMouseOverSlot != this) {
            DragManager.mouseOverSlot = undefined;
            DragManager.lastMouseOverSlot = undefined;
            DragManager.mouseOverSlotX = undefined;
            DragManager.mouseOverSlotY = undefined;
        }
    }
    
    private handleMouseLeaveItem(event: React.MouseEvent) {
        if(DragManager.currentDraggingSlot == undefined && DragManager.mouseOverSlot == this) {
            DragManager.mouseOverSlot = undefined;
            DragManager.lastMouseOverSlot = this;
            DragManager.mouseOverSlotX = undefined;
            DragManager.mouseOverSlotY = undefined;

            setTimeout(() => {
                DragManager.lastMouseOverSlot = undefined;
            }, 200);
        }
    }
    
    private handleMouseLeaveItemSlot(event: React.MouseEvent) {
        if(DragManager.currentDraggingSlot != undefined && DragManager.mouseOverSlot == this) {
            DragManager.mouseOverSlot = undefined;
            DragManager.lastMouseOverSlot = this;
            DragManager.mouseOverSlotX = undefined;
            DragManager.mouseOverSlotY = undefined;

            setTimeout(() => {
                DragManager.lastMouseOverSlot = undefined;
            }, 200);
        }
    }

    public render(): React.ReactNode {
        const dragging: boolean = DragManager.currentDraggingSlot != undefined;
        const draggingMe: boolean = DragManager.currentDraggingSlot == this;

        let translateX: number = draggingMe ? DragManager.translateX! : 0;
        let translateY: number = draggingMe ? DragManager.translateY! : 0;

        if(draggingMe) {
            translateX = DragManager.translateX!;
            translateY = DragManager.translateY!;
        }

        if(dragging && !draggingMe && DragManager.mouseOverSlot == this) {
            translateX = DragManager.originalX!
                - DragManager.originalMouseOffsetX!
                - DragManager.mouseOverSlotX!;
            translateY = DragManager.originalY!
                - DragManager.originalMouseOffsetY!
                - DragManager.mouseOverSlotY!;
        }

        if(!dragging && DragManager.lastDraggingSlot == this && DragManager.lastMouseOverSlot != undefined) {
            translateX = 0;
            translateY = 0;
        }

        const innerClasses: [string] = [
            'item'
        ];

        const outerClasses: [string] = [
            'inventorySlot'
        ];

        if(DragManager.moveComplete) {
            innerClasses.push('justMoved');
        }

        if(draggingMe) {
            innerClasses.push('dragging');
            outerClasses.push('dragging');
        }

        if(DragManager.mouseOverSlot == this) {
            innerClasses.push('hovered');
            outerClasses.push('hovered');
        }

        if(DragManager.lastMouseOverSlot == this) {
            innerClasses.push('lastHovered');
            outerClasses.push('lastHovered');
        }

        if(DragManager.lastDraggingSlot == this) {
            outerClasses.push('lastDragged');
        }

        const innerStyle = {
            transform: `translate(${translateX}px, ${translateY}px)`,
        };
        

        const outerStyle = {
            order: InventoryStore.inventory!.slots[this.props.slotIndex].slotNumber
        }

        return (
            <div 
                className={ outerClasses.join(' ') }
                style={ outerStyle as React.CSSProperties }
                onMouseLeave={ this.handleMouseLeaveItemSlot }
            >
                <div 
                    className={ innerClasses.join(' ') }
                    onMouseDown={ this.handleBeginDraggingItem }
                    onMouseEnter={ this.handleMouseEnterItem }
                    onMouseLeave={ this.handleMouseLeaveItem }
                    style={ innerStyle as React.CSSProperties }
                >
                    { InventoryStore.inventory!.slots[this.props.slotIndex].item!.name }
                </div>
            </div>
        );
    }
}

export default InventorySlot;