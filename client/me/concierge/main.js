/** @format */

/**
 * External dependencies
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import QueryConciergeShifts from 'components/data/query-concierge-shifts';
import { getConciergeShifts } from 'state/selectors';
import { WPCOM_CONCIERGE_SCHEDULE_ID } from './constants';

class ConciergeMain extends Component {
	render() {
		const { shifts } = this.props;

		// TODO:
		// render the shifts for real.
		return (
			<div>
				<QueryConciergeShifts scheduleId={ WPCOM_CONCIERGE_SCHEDULE_ID } />
				<div>{ JSON.stringify( shifts ) }</div>
			</div>
		);
	}
}

export default connect(
	state => ( {
		shifts: getConciergeShifts( state ),
	} ),
	{ getConciergeShifts }
)( localize( ConciergeMain ) );
