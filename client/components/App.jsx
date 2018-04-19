import React from 'react';
import UsersTable from './UsersTable/UsersTable.js'

class App extends React.Component {

  render() {
    return (
      <UsersTable
            usersListUrl="http://localhost:3000/api/users"
            userUrl="http://localhost:3000/api/user/" />
    );
  }

}

export default App;