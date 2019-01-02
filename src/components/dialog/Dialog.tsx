import React from 'react';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

interface MyComponentProps{
    open: boolean,
    data: any,
    onClose: any
}

interface MyComponentState{
}

class UiDialog extends React.Component<MyComponentProps, MyComponentState> {
    render() {
      return (
        <Dialog open={this.props.open} maxWidth='sm' fullWidth={true}>
            <img src={this.props.data.flag} style={{maxWidth: '150px', margin: '0 auto', paddingTop: '20px'}}></img>
          <DialogTitle id="simple-dialog-title" style={{textAlign: 'center'}}>{this.props.data.name}</DialogTitle>
          <div>
            {/*</div>{Object.keys(this.props.data).map((item, i) => {*/}
                <List>
                    <ListItem>
                    <span>Population: {this.props.data.population}</span>
                    </ListItem>
                    <ListItem>
                    <span>Area: {this.props.data.area}</span>
                    </ListItem>
                    <ListItem>
                    <span>Region: {this.props.data.region}</span>
                    </ListItem>
                </List>
            {/*})}*/}
          </div>
          <DialogActions>
            <Button onClick={this.props.onClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      );
    }
  }


export default UiDialog;