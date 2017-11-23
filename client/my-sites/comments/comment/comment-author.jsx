/** @format */
/**
 * External dependencies
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import Gridicon from 'gridicons';
import { get, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import { isEnabled } from 'config';
import Emojify from 'client/components/emojify';
import ExternalLink from 'client/components/external-link';
import Gravatar from 'client/components/gravatar';
import CommentPostLink from 'client/my-sites/comments/comment/comment-post-link';
import { decodeEntities } from 'client/lib/formatting';
import { urlToDomainAndPath } from 'client/lib/url';
import { getSiteComment } from 'client/state/selectors';
import { getSelectedSiteId, getSelectedSiteSlug } from 'client/state/ui/selectors';

export class CommentAuthor extends Component {
	static propTypes = {
		commentId: PropTypes.number,
		isBulkMode: PropTypes.bool,
		isPostView: PropTypes.bool,
	};

	shouldComponentUpdate = nextProps => ! isEqual( this.props, nextProps );

	commentHasLink = () => {
		if ( typeof DOMParser !== 'undefined' && DOMParser.prototype.parseFromString ) {
			const parser = new DOMParser();
			const commentDom = parser.parseFromString( this.props.commentContent, 'text/html' );

			return !! commentDom.getElementsByTagName( 'a' ).length;
		}

		return false;
	};

	render() {
		const {
			authorAvatarUrl,
			authorDisplayName,
			authorUrl,
			commentDate,
			commentId,
			commentType,
			commentUrl,
			gravatarUser,
			isBulkMode,
			isPostView,
			moment,
			translate,
		} = this.props;

		const formattedDate = moment( commentDate ).format( 'll LT' );

		const relativeDate = moment()
			.subtract( 1, 'month' )
			.isBefore( commentDate )
			? moment( commentDate ).fromNow()
			: moment( commentDate ).format( 'll' );

		return (
			<div className="comment__author">
				<div className="comment__author-avatar">
					{ /* A comment can be of type 'comment', 'pingback' or 'trackback'. */ }
					{ 'comment' === commentType && !! authorAvatarUrl && <Gravatar user={ gravatarUser } /> }
					{ 'comment' === commentType &&
						! authorAvatarUrl && <span className="comment__author-gravatar-placeholder" /> }
					{ 'comment' !== commentType && <Gridicon icon="link" size={ 24 } /> }
				</div>

				<div className="comment__author-info">
					<div className="comment__author-info-element">
						{ this.commentHasLink() && (
							<Gridicon icon="link" size={ 18 } className="comment__author-has-link" />
						) }
						<strong className="comment__author-name">
							<Emojify>{ authorDisplayName || translate( 'Anonymous' ) }</Emojify>
						</strong>
						{ isBulkMode && ! isPostView && <CommentPostLink { ...{ commentId, isBulkMode } } /> }
					</div>

					<div className="comment__author-info-element">
						<span className="comment__date">
							{ isEnabled( 'comments/management/comment-view' ) ? (
								<a href={ commentUrl } title={ formattedDate }>
									{ relativeDate }
								</a>
							) : (
								<ExternalLink href={ commentUrl } title={ formattedDate }>
									{ relativeDate }
								</ExternalLink>
							) }
						</span>
						{ authorUrl && (
							<span className="comment__author-url">
								<span className="comment__author-url-separator">&middot;</span>
								<ExternalLink href={ authorUrl }>
									<Emojify>{ urlToDomainAndPath( authorUrl ) }</Emojify>
								</ExternalLink>
							</span>
						) }
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = ( state, { commentId } ) => {
	const siteId = getSelectedSiteId( state );
	const siteSlug = getSelectedSiteSlug( state );
	const comment = getSiteComment( state, siteId, commentId );
	const authorAvatarUrl = get( comment, 'author.avatar_URL' );
	const authorDisplayName = decodeEntities( get( comment, 'author.name' ) );
	const gravatarUser = { avatar_URL: authorAvatarUrl, display_name: authorDisplayName };

	return {
		authorAvatarUrl,
		authorDisplayName,
		authorUrl: get( comment, 'author.URL', '' ),
		commentContent: get( comment, 'content' ),
		commentDate: get( comment, 'date' ),
		commentType: get( comment, 'type', 'comment' ),
		commentUrl: isEnabled( 'comments/management/comment-view' )
			? `/comment/${ siteSlug }/${ commentId }`
			: get( comment, 'URL' ),
		gravatarUser,
	};
};

export default connect( mapStateToProps )( localize( CommentAuthor ) );
