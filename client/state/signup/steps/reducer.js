/** @format */

/**
 * Internal dependencies
 */

import designType from './design-type/reducer';
import siteTitle from './site-title/reducer';
import { combineReducers } from 'client/state/utils';
import survey from './survey/reducer';

export default combineReducers( {
	designType,
	siteTitle,
	survey,
} );
