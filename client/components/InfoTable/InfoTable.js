import React from 'react';
import Loader from '../Loader/Loader.js'
import GetUsersData from '../../services/LoadUsers.js';

class InfoTable extends React.Component {
    constructor(props) {
        super(props);

        this.url = props.url;
        this.userId = props.userId;
        this.request;

        this.state = {
            info: {},
            isLoading: false
        };
    }

    setNewState(data, isLoading, errorMessage) {
        this.setState({
            info: data,
            isLoading: !!isLoading,
            error: errorMessage
        });
    }

    static processData(data) {
        data = data || {};
        data.addressLine = '';
        data.companyDataString = '';
        data.mapLink = '';

        const address = data.address;
        const company = data.company;

        if (address) {
            const geo = address.geo;
            let mapLink = '';

            if (geo.lat && geo.lng) {
                data.mapLink = 'https://www.openstreetmap.org/?mlat=' + geo.lat + '&mlon=' + geo.lng
            }

            data.addressLine = address.zipcode + ' ' + address.city + ', ' + address.street + ' ' + address.suite + ' ';

        }
        if (company) {
            data.companyDataString = (company.name || '-') + ', ' + (company.bs || '');
        }

        return data;
    }

    componentDidMount() {
        this.setNewState([], true);

        this.request = GetUsersData.getUser(this.url + this.userId);
        this.request.promise.then((successResponse) => {
            if (successResponse && Array.isArray(successResponse.data)) {
                const data = InfoTable.processData(successResponse.data[0]);
                this.setNewState(data, false);
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
                <div className="info-table">
                    <div className="info-table__row info-table__row--head">
                        <div className="info-table__cell">Address</div>
                        <div className="info-table__cell">Website</div>
                        <div className="info-table__cell">Email</div>
                        <div className="info-table__cell">Phone</div>
                        <div className="info-table__cell">Company</div>
                    </div>
                    <div className="info-table__row">
                        <div className="info-table__cell">
                            {this.state.info.addressLine}
                            {
                                this.state.info.mapLink && (
                                    <span>
                                        (<a href={this.state.info.mapLink} target="_blank">map</a>)
                                    </span>
                                )
                            }

                        </div>
                        <div className="info-table__cell">
                            {
                                this.state.info.website && (
                                    <div>
                                        <a href={'http://' + this.state.info.website} target="_blank">{this.state.info.website}</a>
                                    </div>
                                )
                            }
                        </div>
                        <div className="info-table__cell">
                            {
                                this.state.info.email && (
                                    <div>
                                        <a href={'mailto:' + this.state.info.email}>{this.state.info.email}</a>
                                    </div>
                                )
                            }
                        </div>
                        <div className="info-table__cell">{this.state.info.phone}</div>
                        <div className="info-table__cell">{this.state.info.companyDataString}</div>
                    </div>
                </div>
                {
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

export default InfoTable;