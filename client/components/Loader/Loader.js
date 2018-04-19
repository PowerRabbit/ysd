import React from 'react';

class Loader extends React.Component {

    render() {
        return (
            <div className="loader-placeholder">
                <div className="loader-background"></div>
                <div className="loader">loading</div>
            </div>
        )
    }

}

export default Loader;