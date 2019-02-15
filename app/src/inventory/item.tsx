import * as React from 'react';
import './item.css';
import inventoryStore from './inventoryStore';
import { observer } from 'mobx-react';

interface ItemProps {
    slotNumber: number;
}

@observer
class Item extends React.Component<ItemProps, {}> {
    public render(): React.ReactNode {
        return (
            <div className="item">
                { inventoryStore.inventory!.items[this.props.slotNumber].item }
            </div>
        );
    }
}

export default Item;