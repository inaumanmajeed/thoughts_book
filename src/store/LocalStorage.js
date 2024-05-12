// localStorage.js

// Save Redux state to local storage
export const saveStateToLocalStorage = (state) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem('reduxState', serializedState);
    } catch (error) {
      console.error('Error saving state to local storage:', error);
    }
  };
  
  // Load Redux state from local storage
  export const loadStateFromLocalStorage = () => {
    try {
      const serializedState = localStorage.getItem('reduxState');
      if (serializedState === null) {
        return undefined; // Return undefined if no state is saved
      }
      return JSON.parse(serializedState); // Parse the serialized state back to JavaScript object
    } catch (error) {
      console.error('Error loading state from local storage:', error);
      return undefined; // Return undefined in case of any error
    }
  };
  