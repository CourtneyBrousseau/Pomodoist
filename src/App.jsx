import React from 'react';
import Timer from './components/Timer';
import TodoItem from './components/TodoItem';
import TodoInput from './components/TodoInput';
import ClearButton from './components/ClearButton';
import EmptyState from './components/EmptyState';

import './styles/App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.addItem = this.addItem.bind(this);
    this.clearCompletedItems = this.clearCompletedItems.bind(this);
    this.startSession = this.startSession.bind(this);
    this.increaseSessionsCompleted = this.increaseSessionsCompleted.bind(this);
    this.toggleItemIsCompleted = this.toggleItemIsCompleted.bind(this);

    this.state = {
      items: [],
      nextItemId: 0,
      sessionIsRunning: false,
      itemIdRunning: null
    };
  }

  addItem(description) {
    const { nextItemId } = this.state;
    const newItem = {
      id: nextItemId, // a unique id identifying this item
      description: description, // a brief description of the todo item
      sessionsCompleted: 0, // how many times a pomodoro session has been completed
      isCompleted: false, // whether the item has 
    };
    this.setState((prevState => ({
      items: [...prevState.items, newItem],
      nextItemId: prevState.nextItemId + 1
    })));
  }

  clearCompletedItems() {
    const newItems = this.state.items.filter(item => !item.isCompleted);
    this.setState({
      items: newItems
    });
  }

  increaseSessionsCompleted(itemId) {
    let newItems = [...this.state.items];
    newItems.forEach((item) => {
        if (item.id === itemId) {
          item.sessionsCompleted += 1;
        }
      }
    );
    this.setState({items: newItems});
  }

  toggleItemIsCompleted(itemId) {
    let newItems = [...this.state.items];
    newItems.forEach((item) => {
        if (item.id === itemId) {
          item.isCompleted = !item.isCompleted;
        }
      }
    );
    this.setState({items: newItems});
  }

  startSession(id) {
    this.setState({
      sessionIsRunning: true,
      itemIdRunning: id
    });
  }

  render() {
    const {
      items,
      sessionIsRunning,
      itemIdRunning,
    } = this.state;
    let areItemsMarkedAsCompleted = false;
    items.forEach((item) => {
        if (item.isCompleted) {
          areItemsMarkedAsCompleted = true;
        }
      }
    );
    return (
      <div className="flex-wrapper">
        <div className="container">
          <header>
            <h1 className="heading">Today</h1>
            {areItemsMarkedAsCompleted ? <ClearButton onClick={this.clearCompletedItems} /> : null}
          </header>
          {sessionIsRunning ? <Timer
            key={itemIdRunning}
            mode="WORK"
            onSessionComplete={() => this.increaseSessionsCompleted(itemIdRunning)}
            autoPlays /> : null
          }
          {items.length == 0 ? (
            <EmptyState />
            ) : (
            <div className="items-container">
            {items.map((item) => <TodoItem 
                                  key={item.id} 
                                  description={item.description}
                                  sessionsCompleted={item.sessionsCompleted}
                                  isCompleted={item.isCompleted}
                                  toggleIsCompleted={() => this.toggleItemIsCompleted(item.id)}
                                  startSession={() => this.startSession(item.id)} />)
            }
            </div>
            )
          }
        </div>
        <footer>
          <TodoInput addItem={this.addItem} />
        </footer>
      </div>
    );
  }
}

export default App;
