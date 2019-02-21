import { setTimeout } from 'timers';

import { observer } from 'mobx-react';
import * as React from 'react';

import DragManager from './DragManager';
import { Item, Slot } from './inventoryModel';
import './inventorySlot.css';
import InventoryStore from './InventoryStore';

interface InventorySlotProps {
    slotIndex: number;
}

@observer
class InventorySlot extends React.Component<InventorySlotProps, {}> {
    constructor(props: InventorySlotProps) {
        super(props);

        this.handleMouseButtonDown = this.handleMouseButtonDown.bind(this);
        this.handleMouseButtonMoved = this.handleMouseButtonMoved.bind(this);
        this.handleMouseButtonUp = this.handleMouseButtonUp.bind(this);

        this.handleMouseEnterItem = this.handleMouseEnterItem.bind(this);
        this.handleMouseLeaveItem = this.handleMouseLeaveItem.bind(this);

        this.handleMouseLeaveItemSlot = this.handleMouseLeaveItemSlot.bind(this);

        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchMoved = this.handleTouchMoved.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
    }

    public get item(): Item | undefined {
        if(this.slot !== undefined) {
            return this.slot.item;
        } else {
            return undefined;
        }
    }

    public get slot(): Slot {
        return InventoryStore.getSlotWithIndex(this.props.slotIndex);
    }

    public get hasItem(): boolean {
        return this.item !== undefined;
    }

    public render(): React.ReactNode {
        const dragging: boolean = DragManager.currentDraggingSlot !== undefined;
        const draggingMe: boolean = DragManager.currentDraggingSlot === this;

        let translateX: number = draggingMe ? DragManager.translateX! : 0;
        let translateY: number = draggingMe ? DragManager.translateY! : 0;

        if(draggingMe || (DragManager.lastDraggingSlot === this && DragManager.moveComplete)) {
            translateX = DragManager.translateX!;
            translateY = DragManager.translateY!;
        }

        if(dragging && !draggingMe && DragManager.mouseOverSlot === this) {
            translateX = DragManager.currentDraggingSlotOriginalX!
                - DragManager.mouseOffsetOriginalX!
                - DragManager.mouseOverSlotOriginalX!;
            translateY = DragManager.currentDraggingSlotOriginalY!
                - DragManager.mouseOffsetOriginalY!
                - DragManager.mouseOverSlotOriginalY!;
        }

        const itemClasses: [string] = [
            'item'
        ];

        const slotClasses: [string] = [
            'inventorySlot'
        ];

        if(DragManager.moveComplete) {
            itemClasses.push('justMoved');
        }

        if(draggingMe) {
            itemClasses.push('dragging');
            slotClasses.push('dragging');
        }

        if(DragManager.mouseOverSlot === this) {
            itemClasses.push('hovered');
            slotClasses.push('hovered');
        }

        if(DragManager.lastMouseOverSlot === this) {
            itemClasses.push('lastHovered');
            slotClasses.push('lastHovered');
        }

        if(DragManager.lastDraggingSlot === this) {
            slotClasses.push('lastDragged');
        }

        const itemStyle = {
            transform: `translate(${translateX}px, ${translateY}px)`
        };

        const slotStyle = {
            order: this.slot!.slotNumber
        };

        return (
            <div
                className={ slotClasses.join(' ') }
                style={ slotStyle as React.CSSProperties }
                onMouseLeave={ this.handleMouseLeaveItemSlot }
            >
                { this.renderItem(itemClasses, itemStyle) }
            </div>
        );
    }

    private renderItem(classes: string[], style: React.CSSProperties): React.ReactNode {
        if(this.item !== undefined) {
            switch(this.item.rarity) {
                case 1:
                    classes.push('uncommon');
                    break;
                case 2:
                    classes.push('rare');
                    break;
                case 3:
                    classes.push('legendary');
                    break;
                case 4:
                    classes.push('cheat');
                    break;
            }

            return (
                <div
                    className={ classes.join(' ') }
                    onMouseDown={ this.handleMouseButtonDown }
                    onMouseEnter={ this.handleMouseEnterItem }
                    onMouseLeave={ this.handleMouseLeaveItem }
                    onTouchStart={ this.handleTouchStart }
                    onTouchMove={ this.handleTouchMoved }
                    style={ style as React.CSSProperties }
                >
                    { this.item.name }
                </div>
            );
        } else {

            classes = ['item', 'empty'];

            if(DragManager.isDragging) {
                classes.push('hoverWhileDragging');
            }

            return (
                <div
                    className= { classes.join(' ') }
                    onMouseEnter={ this.handleMouseEnterItem }
                    onMouseLeave={ this.handleMouseLeaveItem }
                    onTouchStart={ this.handleTouchStart }
                    onTouchMove={ this.handleTouchMoved }
                >
                </div>
            );
        }
    }

    private handleMouseButtonDown(event: React.MouseEvent): void {
        if(event.button === 0 && DragManager.isEnabled) {
            const mouseX: number = event.pageX;
            const mouseY: number = event.pageY;

            this.beginDraggingItem(mouseX, mouseY, event.currentTarget);
        }
    }

    private handleMouseButtonMoved(event: MouseEvent): void {
        if(event.button === 0 && DragManager.isEnabled) {
            const mouseX: number = event.pageX;
            const mouseY: number = event.pageY;

            this.doDragItem(mouseX, mouseY);
        }
    }

    private handleMouseButtonUp(event: MouseEvent): void {
        if(event.button === 0 && DragManager.isEnabled) {
            const mouseX: number = event.pageX;
            const mouseY: number = event.pageY;

            this.finishDraggingItem(mouseX, mouseY);
        }
    }

    private handleMouseEnterItem(event: React.MouseEvent): void {
        if(event.button === 0 && DragManager.isEnabled) {
            const mouseX: number = event.pageX;
            const mouseY: number = event.pageY;

            this.beginHoveringItem(mouseX, mouseY, event.currentTarget);
        }
    }

    private handleMouseLeaveItem(event: React.MouseEvent): void {
        if(event.button === 0 && DragManager.isEnabled) {
            const mouseX: number = event.pageX;
            const mouseY: number = event.pageY;

            this.finishHoveringItem(mouseX, mouseY, event.currentTarget);
        }
    }

    private handleMouseLeaveItemSlot(event: React.MouseEvent): void {
        if(event.button === 0 && DragManager.isEnabled) {
            const mouseX: number = event.pageX;
            const mouseY: number = event.pageY;

            this.finishHoveringItemSlot(mouseX, mouseY, event.currentTarget);
        }
    }

    private handleTouchStart(event: React.TouchEvent): void {
        if(DragManager.isEnabled) {
            const mouseX: number = event.changedTouches[0].pageX;
            const mouseY: number = event.changedTouches[0].pageY;

            this.beginDraggingItem(mouseX, mouseY, event.currentTarget);
        }
    }

    private handleTouchMoved(event: React.TouchEvent): void {
        if(DragManager.isEnabled && DragManager.currentDraggingSlot === this) {
            const mouseX: number = event.changedTouches[0].pageX;
            const mouseY: number = event.changedTouches[0].pageY;

            this.doDragItem(mouseX, mouseY);
        }
    }

    private handleTouchEnd(event: TouchEvent): void {
        if(DragManager.isEnabled) {
            const mouseX: number = event.changedTouches[0].pageX;
            const mouseY: number = event.changedTouches[0].pageY;

            this.finishDraggingItem(mouseX, mouseY);
        }
    }

    private beginDraggingItem(x: number, y: number, target: Element): void {
        if(DragManager.lastDraggingSlot !== this) {
            const rect: ClientRect | DOMRect = target.getBoundingClientRect();
            const absoluteX = rect.left;
            const absoluteY = rect.top;

            DragManager.currentDraggingSlot = this;

            DragManager.mouseOffsetOriginalX = x - absoluteX;
            DragManager.mouseOffsetOriginalY = y - absoluteY;

            DragManager.currentDraggingSlotOriginalX = absoluteX + DragManager.mouseOffsetOriginalX;
            DragManager.currentDraggingSlotOriginalY = absoluteY + DragManager.mouseOffsetOriginalY;

            window.addEventListener('mousemove', this.handleMouseButtonMoved);
            window.addEventListener('mouseup', this.handleMouseButtonUp);
            window.addEventListener('touchend', this.handleTouchEnd);
        }
    }

    private doDragItem(x: number, y: number): void {
        if(DragManager.mouseOverSlot === this) {
            DragManager.mouseOverSlot = undefined;
        }

        DragManager.translateX = x - DragManager.currentDraggingSlotOriginalX!;
        DragManager.translateY = y - DragManager.currentDraggingSlotOriginalY!;
    }

    private finishDraggingItem(x: number, y: number): void {
        window.removeEventListener('mousemove', this.handleMouseButtonMoved);
        window.removeEventListener('mouseup', this.handleMouseButtonUp);
        window.removeEventListener('touchend', this.handleTouchEnd);

        if(DragManager.mouseOverSlot !== this && DragManager.mouseOverSlot !== undefined) {
            const mouseOverSlot = DragManager.mouseOverSlot!;
            const mySlot: number = this.slot.slotNumber;
            const otherSlot: number = mouseOverSlot.slot.slotNumber;

            this.slot.slotNumber = otherSlot;
            mouseOverSlot.slot.slotNumber = mySlot;

            DragManager.translateX = x
                - DragManager.mouseOverSlotOriginalX!
                - DragManager.mouseOffsetOriginalX!;
            DragManager.translateY = y
                - DragManager.mouseOverSlotOriginalY!
                - DragManager.mouseOffsetOriginalY!;
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
        DragManager.currentDraggingSlotOriginalX = undefined;
        DragManager.currentDraggingSlotOriginalY = undefined;
        DragManager.translateX = undefined;
        DragManager.translateY = undefined;
        DragManager.mouseOffsetOriginalX = undefined;
        DragManager.mouseOffsetOriginalY = undefined;
    }

    private beginHoveringItem(x: number, y: number, target: Element): void {
        if(DragManager.currentDraggingSlot !== this && DragManager.lastMouseOverSlot !== this) {
            const rect: ClientRect | DOMRect = target.getBoundingClientRect();
            const absoluteX = rect.left;
            const absoluteY = rect.top;

            DragManager.mouseOverSlot = this;
            DragManager.mouseOverSlotOriginalX = absoluteX;
            DragManager.mouseOverSlotOriginalY = absoluteY;
        } else if(DragManager.currentDraggingSlot === this && DragManager.lastMouseOverSlot !== this) {
            DragManager.mouseOverSlot = undefined;
            DragManager.lastMouseOverSlot = undefined;
            DragManager.mouseOverSlotOriginalX = undefined;
            DragManager.mouseOverSlotOriginalY = undefined;
        }
    }

    private finishHoveringItem(x: number, y: number, target: Element): void {
        if(DragManager.currentDraggingSlot === undefined && DragManager.mouseOverSlot === this) {
            DragManager.mouseOverSlot = undefined;
            DragManager.lastMouseOverSlot = this;
            DragManager.mouseOverSlotOriginalX = undefined;
            DragManager.mouseOverSlotOriginalY = undefined;

            setTimeout(() => {
                DragManager.lastMouseOverSlot = undefined;
            }, 200);
        }
    }

    private finishHoveringItemSlot(x: number, y: number, target: Element): void {
        if(DragManager.currentDraggingSlot !== undefined && DragManager.mouseOverSlot === this) {
            DragManager.mouseOverSlot = undefined;
            DragManager.lastMouseOverSlot = this;
            DragManager.mouseOverSlotOriginalX = undefined;
            DragManager.mouseOverSlotOriginalY = undefined;

            setTimeout(() => {
                DragManager.lastMouseOverSlot = undefined;
            }, 200);
        }
    }
}

export default InventorySlot;
