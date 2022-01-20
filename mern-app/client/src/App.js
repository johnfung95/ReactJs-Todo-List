import React, { Component } from "react";
import gql from 'graphql-tag';
import { graphql } from '@apollo/react-hoc';
import { flowRight as compose } from 'lodash';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

const TodosQuery = gql`{
	todos {
    id
    text
    complete
  }
}`

const UpdateMutation = gql`
  mutation($id: ID!, $complete: Boolean!) {
    updateTodo(id: $id, complete: $complete) 
  }
`
class App extends Component {
  // state to change, but we uses mongo db
  // state = {
  //   checked: [0],
  // };

  updateTodo = async todo => {
    // const { checked } = this.state;
    // const currentIndex = checked.indexOf(value);
    // const newChecked = [...checked];

    // if (currentIndex === -1) {
    //   newChecked.push(value);
    // } else {
    //   newChecked.splice(currentIndex, 1);
    // }

    // this.setState({
    //   checked: newChecked,
    // });


    // update the todo items
    await this.props.updateTodo({
      variables: {
        id: todo.id,
        complete: !todo.complete
      }
    });
  };

  removeTodo = todo => {
    //remove todo
  }

  render() {
    const { data: { loading, todos } } = this.props;
    if (loading) {
      return null;
    }

    return <div style={{ display: "flex" }}>
      <div style={{ margin: "auto", width: 400 }}>
        <Paper elevation={1}>
          {/* {todos.map(todo => (<div key={`${todo.id}-todo-item`}>{todo.text}</div>))} */}
        </Paper>
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {todos.map(todo => {
            const labelId = `checkbox-list-label-${todos.id}`;

            return (
              <ListItem
                key={todos.id}
                secondaryAction={
                  <IconButton edge="end" onClick={() => this.removeTodo(todo)}>
                    <DeleteIcon />
                  </IconButton>
                }
                disablePadding
              >
                <ListItemButton role={undefined} onClick={this.updateTodo(todo)} dense>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={todo.complete}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={todo.text} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>
    </div>
  }
}

// injecting the todo query into the app
export default compose(
  graphql(UpdateMutation, { name: 'updateTodo' }),
  graphql(TodosQuery))(App);