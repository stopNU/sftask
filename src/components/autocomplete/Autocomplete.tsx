import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { withStyles, createStyles } from '@material-ui/core/styles';

function renderInputComponent(inputProps: any) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion:any, object:any) {
  const matches = match(suggestion.name, object.query);
  const parts = parse(suggestion.name, matches);

  

  return (
    <MenuItem selected={object.isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          );
        })}
      </div>
    </MenuItem>
  );
}

/*
interface MySuggestionsArray{
  name: string
}

function getSuggestions(value:any, suggestions: Array<MySuggestionsArray>) {
  console.log("trim", value.trim());
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
      //console.log(suggestion.name);
        const keep =
          count < 5 && suggestion.name.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}*/

function getSuggestionValue(suggestion:any) {
  return suggestion;
}

const styles = (theme: any) => createStyles({
  root: {
    height: 250,
    flexGrow: 1,
  },
  container: {
    position: 'relative',
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
    maxHeight: 220,
    overflow: 'auto',
  },
  suggestion: {
    display: 'block',
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
});

interface MyComponentProps{
  classes: any,
  suggestions: [],
  value: string,
  handleChange: any
}

interface MyComponentState{
  single: string,
  popper: string,
  suggestions: any
}

class IntegrationAutosuggest extends React.Component<MyComponentProps, MyComponentState>  {
  constructor(props: any){
    super(props);
    this.state = {
      single: '',
      popper: '',
      suggestions: []
    };
}
  handleClick = () => {
    console.log("handleClick");
  }

  handleSuggestionsFetchRequested = ( object:any ) => {
    this.setState({
      suggestions: this.props.suggestions,
      //getSuggestions(object.value, this.props.suggestions)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  /*handleChange = (name:string) => (event:any, object:any ) => {
    this.setState({
      single: object.newValue,
    });
  };*/

  render() {
    const { classes } = this.props;

    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.props.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            placeholder: 'Search a country...',
            value: this.props.value,
            onChange: this.props.handleChange(),
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
      </div>
    );
  }
}

export default withStyles(styles)(IntegrationAutosuggest);