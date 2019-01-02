import React from 'react';
//import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import { withStyles, createStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from './TablePaginationActions';
import LinearProgress from '@material-ui/core/LinearProgress';
import EnhancedTableHead from './TableHeaderSort';
import IntegrationAutosuggest from '../autocomplete/Autocomplete';
import UiDialog from '../dialog/Dialog';
import Paper from '@material-ui/core/Paper';
//import ClickNHold from 'react-click-n-hold';
import axios from 'axios';

const styles = (theme: any) => createStyles({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
    padding: '20px'
  },
  tableRow: {
    cursor: 'pointer'
  }
});

const headerRows = [
    //{ id: 'index', numeric: true, disablePadding: false, label: 'Index' },
    { id: 'name', numeric: false, disablePadding: false, label: 'Country' },
    { id: 'population', numeric: true, disablePadding: false, label: 'Population' },
];

const actionsStyles = (theme: any) => ({
    root: {
      flexShrink: 0,
      color: theme.palette.text.secondary,
      marginLeft: theme.spacing.unit * 2.5
    }
  });

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
    TablePaginationActions,
);


//Sorting
function desc(a:any, b:any, orderBy:any) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

function getSorting(order:any, orderBy:any) {
    return order === 'desc' ? (a:any, b:any) => desc(a, b, orderBy) : (a:any, b:any) => -desc(a, b, orderBy);
}

function stableSort(array:any, cmp:any) {
    const stabilizedThis = array.map((el:any, index:any) => [el, index]);
    stabilizedThis.sort((a:any, b:any) => {
      const order = cmp(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el:any) => el[0]);
}
// End of sorting 

interface IRowsArray{
    name?: any
}

/*** Class: SimpleTable ***/

interface SimpleTableProps{
    classes: any,
   //buttonPressTimer: string
}

interface SimpleTableState{
    rows: [],
    filteredRows: Array<IRowsArray>,
    page: number,
    rowsPerPage: number,
    order: string,
    orderBy: string,
    input: string,
    openDialog: boolean,
    openDialogData: object,
    completed: number,
    rowClicked: string
}

class SimpleTable extends React.Component<SimpleTableProps, SimpleTableState>{ 
    constructor(props: any){
        super(props);
        //this.buttonPressTimer = 0;
        this.state = { 
            rows: [],
            filteredRows: [],
            page: 0,
            rowsPerPage: 5, 
            order: 'asc',
            orderBy: 'name',
            input: '',
            openDialog: false,
            openDialogData: {},
            completed: 0,
            rowClicked: ''
        };
    }
    buttonPressTimer: any = null;
    buttonPressTimer2: any = null;

    handleInputChange = (name:string) => (event:any, object:any ) => {
        console.log("handleInputChange", object.newValue);
        let inputValue = object.newValue;

        //If click on autocomplete suggestion (object is returned as newValue insted of just input value)
        if(object.newValue.name){
            inputValue = object.newValue.name;
            this.showDialogClick(object.newValue);
        }
        else{
            const path = inputValue.length > 0 ? `https://restcountries.eu/rest/v2/name/` + inputValue : `https://restcountries.eu/rest/v2/all`;

            axios.get(path).then(res => {
                this.setState({
                    filteredRows: res.data,
                });
            }).catch(error => {
                console.log(error);
            })
        }

        this.setState({
            input: inputValue,
        });
    };

    handleRowClick = (name:string) => {
        axios.get(`https://restcountries.eu/rest/v2/name/` + name).then(res => {
            this.showDialogClick(res.data[0]);
        }).catch(error => {
            console.log(error);
        })
    }

    showDialogClick = (rowData:object) => {
        this.setState({
            openDialog: true,
            openDialogData: rowData
        })
    }

    handleDialogClose = () => {
        this.setState({ openDialog: false });
    };

    handleChangePage = (event:any, page:number) => {
        this.setState({ page });
    };
    
    handleChangeRowsPerPage = (event:any) => {
        this.setState({ rowsPerPage: event.target.value });
    };

    handleRequestSort = (event:any, property:any) => {
        const orderBy = property;
        let order = 'desc';

        if (this.state.orderBy === property && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderBy });
    };

    handleButtonPress = (name:any) => {
        this.setState({rowClicked: name});
        //for timer
        this.buttonPressTimer = setInterval(() => { 
            this.setState(prevState => ({
                completed: prevState.completed + 20,
                rowClicked: name
            }));
        }, 500);
        //for click
        this.buttonPressTimer2 = setTimeout(() => {
            this.handleButtonRelease(name);
        }, 3000);
    }

    handleButtonRelease = (name:any) => {
        const { completed } = this.state;
        clearTimeout(this.buttonPressTimer2);
        clearInterval(this.buttonPressTimer);
        if (completed >= 100) {
            this.handleRowClick(name);
        }
        this.setState({ completed: 0, rowClicked: '' });
    }

    componentDidMount() {
        axios.get(`https://restcountries.eu/rest/v2/all`).then(res => {
            const rows = res.data;
            this.setState({ rows: rows, filteredRows: rows });
        })
    }

    public render() {
        const { classes } = this.props;
        const { rows, filteredRows, rowsPerPage, page, order, orderBy, rowClicked } = this.state;
        //console.log("filteredRows", filteredRows);
        return (
            <React.Fragment>
                <IntegrationAutosuggest suggestions={filteredRows} handleChange={this.handleInputChange} value={this.state.input} />
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <EnhancedTableHead
                            order={order}
                            orderBy={orderBy}
                            onRequestSort={this.handleRequestSort}
                            rows={headerRows}
                        />
                        <TableBody>
                            {stableSort(filteredRows, getSorting(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row:any) => {
                                return (
                                    <React.Fragment>
                                    <TableRow
                                    hover
                                    //onClick={event => this.handleRowClick(event, row.name)}
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.name}
                                    className={classes.tableRow}
                                    onTouchStart={() => this.handleButtonPress(row.name)} 
                                    onTouchEnd={this.handleButtonRelease} 
                                    onMouseDown={() => this.handleButtonPress(row.name)} 
                                    onMouseUp={this.handleButtonRelease}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">{row.population}</TableCell>
                                    </TableRow>
                                    {rowClicked === row.name && <TableRow style={{height: '10px'}}>
                                        <TableCell colSpan={2} style={{border: 'none'}}>
                                        <LinearProgress variant="determinate" value={this.state.completed} />
                                        </TableCell>
                                    </TableRow>}
                                    </React.Fragment>
                                );
                            })}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                colSpan={3}
                                count={filteredRows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
                {/* Dialog popup */}
                <UiDialog open={this.state.openDialog} data={this.state.openDialogData} onClose={this.handleDialogClose}></UiDialog>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(SimpleTable);