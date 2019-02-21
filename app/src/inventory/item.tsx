import { observer } from 'mobx-react';
import * as React from 'react';

import InventoryStore from './InventoryStore';
import './item.css';

interface ItemProps {
    slotNumber: number;
}

@observer
class Item extends React.Component<ItemProps, {}> {
    public render(): React.ReactNode {
        return (
            <div className='item'>
                { InventoryStore.inventory!.slots[this.props.slotNumber].item!.name }
            </div>
        );
    }
}

export default Item;
