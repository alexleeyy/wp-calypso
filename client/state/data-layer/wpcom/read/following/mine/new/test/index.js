/** @format */
/**
 * External dependencies
 */
import { expect } from 'chai';
import { spy } from 'sinon';

/**
 * Internal dependencies
 */
import { requestFollow, receiveFollow, followError } from '../';
import { NOTICE_CREATE } from 'client/state/action-types';
import { bypassDataLayer } from 'client/state/data-layer/utils';
import { http } from 'client/state/data-layer/wpcom-http/actions';
import { follow, unfollow } from 'client/state/reader/follows/actions';

describe( 'requestFollow', () => {
	test( 'should dispatch a http request', () => {
		const dispatch = spy();
		const action = follow( 'http://example.com' );
		const getState = () => ( {
			reader: {
				sites: {
					items: {},
				},
				feeds: {
					items: {},
				},
			},
		} );

		requestFollow( { dispatch, getState }, action );
		expect( dispatch ).to.have.been.calledWith(
			http( {
				method: 'POST',
				path: '/read/following/mine/new',
				apiVersion: '1.1',
				body: {
					url: 'http://example.com',
					source: 'calypso',
				},
				onSuccess: action,
				onFailure: action,
			} )
		);

		expect( dispatch ).to.be.calledWithMatch( {
			type: NOTICE_CREATE,
			notice: { status: 'is-success' },
		} );
	} );
} );

describe( 'receiveFollow', () => {
	test( 'should dispatch updateFollow with new subscription info', () => {
		const dispatch = spy();
		const action = follow( 'http://example.com' );
		const response = {
			subscribed: true,
			subscription: {
				ID: 1,
				URL: 'http://example.com',
				blog_ID: 2,
				feed_ID: 3,
				date_subscribed: '1976-09-15T12:00:00Z',
				delivery_methods: {},
				is_owner: false,
			},
		};
		receiveFollow( { dispatch }, action, response );
		expect( dispatch ).to.be.calledWith(
			bypassDataLayer(
				follow( 'http://example.com', {
					ID: 1,
					URL: 'http://example.com',
					feed_URL: 'http://example.com',
					blog_ID: 2,
					feed_ID: 3,
					date_subscribed: 211636800000,
					delivery_methods: {},
					is_owner: false,
				} )
			)
		);
	} );

	test( 'should dispatch an error notice when subscribed is false', () => {
		const dispatch = spy();
		const action = follow( 'http://example.com' );
		const response = {
			subscribed: false,
		};

		receiveFollow( { dispatch }, action, response );
		expect( dispatch ).to.be.calledWithMatch( {
			type: NOTICE_CREATE,
			notice: { status: 'is-error' },
		} );
		expect( dispatch ).to.be.calledWith( bypassDataLayer( unfollow( 'http://example.com' ) ) );
	} );
} );

describe( 'followError', () => {
	test( 'should dispatch an error notice', () => {
		const dispatch = spy();
		const action = follow( 'http://example.com' );

		followError( { dispatch }, action );
		expect( dispatch ).to.be.calledWithMatch( { type: NOTICE_CREATE } );
		expect( dispatch ).to.be.calledWith( bypassDataLayer( unfollow( 'http://example.com' ) ) );
	} );
} );
