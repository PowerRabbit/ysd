import React from 'react';
import GetUsersData from '../../services/LoadUsers.js';
import InfoTable from '../InfoTable/InfoTable.js'
import Loader from '../Loader/Loader.js'

const classNames = (classes) => {
    return Object.keys(classes).filter(name => classes[name]).join(' ');
};


class UsersTable extends React.Component {

    constructor(props) {
        super(props);

        this.usersListUrl = props.usersListUrl;
        this.userUrl = props.userUrl;
        this.request;

        this.state = {
            users: [],
            isLoading: false,
            error: undefined
        };
    }

    setNewState(data, isLoading, errorMessage) {
        this.setState({
            users: data,
            isLoading: !!isLoading,
            error: errorMessage
        });
    }

    showInfo(id) {
        const newState = Object.assign({}, this.state);
        const user = newState.users.filter((item) => item.id === id)[0];

        user.infoExpanded = !user.infoExpanded;
        this.setState(newState);
    }

    static processData(data) {
        return data.map((user) => {
            const company = user.company;
            user.companyDataString = '';

            if (company) {
                user.companyDataString = (company.name || '-') + ', ' + (company.bs || '');
            }
            return user;
        });
    }

    componentDidMount() {
        this.setNewState([], true);

        this.request = GetUsersData.getAllUsers(this.usersListUrl);
        this.request.promise.then((successResponse) => {
            if (successResponse && Array.isArray(successResponse.data)) {
                const processedData = UsersTable.processData(successResponse.data);
                this.setNewState(processedData, false);
            }
        }, (errorResponse) => {
            this.setNewState([], false, errorResponse.message);
        });
    }

    componentWillUnmount () {
        if (this.request) {
            this.request.cancel();
        }
    }

    render() {
        return (
            <section>
                <div className="user-table">
                    <div className="user-table__row user-table__row--head">
                        <div className="user-table__cell">Name</div>
                        <div className="user-table__cell">Username</div>
                        <div className="user-table__cell">Email</div>
                        <div className="user-table__cell">Phone</div>
                        <div className="user-table__cell">Company</div>
                    </div>
                </div>
                {
                    this.state.users.map((user, k) => {
                        const extendedClassnames = classNames({
                            'user-table__row': true,
                            'user-table__row--selected': user.infoExpanded
                        });
                        return [
                            <div key={k} className="user-table">
                                <div className={extendedClassnames} onClick={() => this.showInfo(user.id)}>
                                    <div className="user-table__cell">{user.name}</div>
                                    <div className="user-table__cell">{user.username}</div>
                                    <div className="user-table__cell">
                                    {
                                        user.email && (
                                            <div>
                                                <a href={'mailto:' + user.email}>{user.email}</a>
                                            </div>
                                        )
                                    }
                                    </div>
                                    <div className="user-table__cell">{user.phone}</div>
                                    <div className="user-table__cell">{user.companyDataString}</div>
                                </div>
                            </div>,
                            <div key={'extended' + k} className="user-table">
                                {
                                   user.infoExpanded && (
                                    <div className="user-table__row">
                                        <div className="user-table__cell user-table__cell--full-row">
                                            <InfoTable url={this.userUrl} userId={user.id} />
                                        </div>
                                    </div>
                                    )
                                }
                            </div>
                        ]
                    })
                } {
                    this.state.isLoading && (
                        <Loader />
                    )
                } {
                    this.state.error && (
                        <div className="error">{this.state.error}</div>
                    )
                }
            </section>
        );
    }

}

export default UsersTable;