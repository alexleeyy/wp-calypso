/**
 * External dependencies
 */
import React from 'react';
import PropTypes from 'prop-types';
import { localize } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import FormField from '../form-field';
import FormSelect from 'components/forms/form-select';
import AppliesToFilteredList from './applies-to-filtered-list';
import ProductSearch from 'woocommerce/components/product-search';
import warn from 'lib/warn';

class PromotionAppliesToField extends React.Component {
	static propTypes = {
		selectionTypes: PropTypes.array.isRequired,
		value: PropTypes.object,
		edit: PropTypes.func.isRequired,
		singular: PropTypes.bool,
	};

	constructor( props ) {
		super( props );
		this.state = {
			appliesToType: null,
		};
	}

	componentWillMount() {
		const { selectionTypes, value } = this.props;
		const initialType = this.getInitialType( selectionTypes, value );

		this.setState( () => ( { appliesToType: initialType } ) );
	}

	componentWillReceiveProps( nextProps ) {
		const { selectionTypes, value } = nextProps;
		const initialType = this.getInitialType( selectionTypes, value );

		this.setState( () => ( { appliesToType: initialType } ) );
	}

	getInitialType( selectionTypes, value ) {
		for ( const selectionType of selectionTypes ) {
			if ( value && value[ selectionType.type ] ) {
				return selectionType.type;
			}
		}

		// No match for a type already in the value, so go with the first.
		return selectionTypes[ 0 ].type;
	}

	getInitialValue( appliesToType, singular, value ) {
		if ( 'all' === appliesToType ) {
			return true;
		}

		const ids = ( value && value[ appliesToType ] ) || [];

		if ( singular ) {
			return ids.slice( 0, 1 );
		}

		return ids;
	}

	initializeValue( appliesToType ) {
		const { value, edit, singular } = this.props;

		const initialValue = this.getInitialValue( appliesToType, singular, value );
		edit( 'appliesTo', { [ appliesToType ]: initialValue } );
	}

	renderTypeSelect = () => {
		const { selectionTypes } = this.props;
		const { appliesToType } = this.state;

		if ( selectionTypes.length === 1 ) {
			return null;
		}

		return (
			<FormSelect value={ appliesToType || '' } onChange={ this.onTypeChange }>
				{ selectionTypes.map( this.renderTypeSelectOption ) }
			</FormSelect>
		);
	};

	renderTypeSelectOption = ( option ) => {
		return (
			<option key={ option.type } value={ option.type }>
				{ option.labelText }
			</option>
		);
	};

	onTypeChange = ( e ) => {
		const appliesToType = e.target.value;
		this.setState( () => ( { appliesToType } ) );
		this.initializeValue( appliesToType );
	};

	onProductIdChange = ( productId ) => {
		const { edit } = this.props;
		edit( 'appliesTo', { productIds: [ productId ] } );
	}

	onProductIdsChange = ( productIds ) => {
		const { edit } = this.props;
		edit( 'appliesTo', { productIds } );
	}

	renderSearch( appliesToType ) {
		const { value, edit, singular } = this.props;

		switch ( appliesToType ) {
			case 'all':
				return null;
			case 'productIds':
				const productIds = ( value && value.productIds ? value.productIds : [] );

				if ( singular ) {
					const productId = productIds.length && productIds[ 0 ];

					return (
						<ProductSearch
							value={ productId }
							onChange={ this.onProductIdChange }
							singular
						/>
					);
				}

				return (
					<ProductSearch
						value={ productIds }
						onChange={ this.onProductIdsChange }
					/>
				);
			case 'productCategoryIds':
				return (
					<AppliesToFilteredList
						appliesToType={ appliesToType }
						singular={ singular }
						value={ value }
						edit={ edit }
					/>
				);
			case null:
				// TODO: Add placeholder?
				return null;
			default:
				warn( `Unrecognized appliesToType: ${ appliesToType }` );
				return null;
		}
	}

	render() {
		const { appliesToType } = this.state;

		return (
			<div className="promotion-applies-to-field">
				<FormField { ...this.props }>
					{ this.renderTypeSelect() }
					{ this.renderSearch( appliesToType ) }
				</FormField>
			</div>
		);
	}
}

export default localize( PromotionAppliesToField );

