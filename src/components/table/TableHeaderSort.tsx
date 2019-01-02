import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';

interface MyComponentProps{
    order: any, 
    orderBy: any, 
    onRequestSort: any,
    rows: any
}

interface MyComponentState{

}

class EnhancedTableHead extends React.Component<MyComponentProps, MyComponentState> {
    createSortHandler = (property:any) => (event:any) => {
        this.props.onRequestSort(event, property);
    };

    render() {
        const { rows, order, orderBy } = this.props;

        return (
        <TableHead>
            <TableRow>
            {rows.map((row:any) => {
                return (
                <TableCell
                    key={row.id}
                    align={row.numeric ? 'right' : 'left'}
                    padding={row.disablePadding ? 'none' : 'default'}
                    sortDirection={orderBy === row.id ? order : false}
                >
                    <Tooltip
                    title="Sort"
                    placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                    >
                    <TableSortLabel
                        active={orderBy === row.id}
                        direction={order}
                        onClick={this.createSortHandler(row.id)}
                    >
                        {row.label}
                    </TableSortLabel>
                    </Tooltip>
                </TableCell>
                );
            }, this)}
            </TableRow>
        </TableHead>
        );
    }
}

  export default EnhancedTableHead;