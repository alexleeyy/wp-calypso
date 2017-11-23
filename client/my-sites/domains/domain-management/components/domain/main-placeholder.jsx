/** @format */

/**
 * External dependencies
 */

import React from 'react';

/**
 * Internal dependencies
 */
import CompactCard from 'client/components/card/compact';
import Header from 'client/my-sites/domains/domain-management/components/header';
import Main from 'client/components/main';
import VerticalNav from 'client/components/vertical-nav';
import VerticalNavItem from 'client/components/vertical-nav/item';

class DomainMainPlaceholder extends React.Component {
	render() {
		return (
			<Main className="domain-main-placeholder">
				<Header onClick={ this.props.goBack } />

				<VerticalNav>
					<CompactCard className="domain-main-placeholder__card">
						<p />
						<p />
						<p />
						<p />
					</CompactCard>

					<VerticalNavItem isPlaceholder />

					<VerticalNavItem isPlaceholder />
				</VerticalNav>
			</Main>
		);
	}
}

export default DomainMainPlaceholder;
