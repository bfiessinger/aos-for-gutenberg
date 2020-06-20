/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { createHigherOrderComponent, withState } = wp.compose;
const { ToggleControl, SelectControl, PanelBody, PanelRow } = wp.components;

/**
 * Add custom attribute for AOS.
 *
 * @param {Object} settings Settings for the block.
 *
 * @return {Object} settings Modified settings.
 */
function gutenbergAOSAttributes(settings) {

	//check if object exists for old Gutenberg version compatibility
	if (typeof settings.attributes !== 'undefined') {

		settings.attributes = Object.assign(settings.attributes, {
			gutenbergUseAOS: {
				type: 'boolean',
				default: false,
			},
			gutenbergAOSAnimation: {
				type: 'select',
				default: 'fade-up'
			}
		});

	}

	return settings;

}

/**
 * Add AOS controls on Inspector Controls.
 *
 * @param {function} BlockEdit Block edit component.
 *
 * @return {function} BlockEdit Modified block edit component.
 */
const gutenbergAOSControls = createHigherOrderComponent((BlockEdit) => {

	return (props) => {

		if (props.name.substring(0, 5) !== 'core/') {
			return (
				<Fragment>
					<BlockEdit {...props} />
				</Fragment>
			);
		}

		const {
			attributes,
			setAttributes,
			isSelected,
		} = props;

		const {
			gutenbergUseAOS,
			gutenbergAOSAnimation
		} = attributes;

		return (
			<Fragment>
				<BlockEdit {...props} />
				{isSelected &&
					<InspectorControls>
						<PanelBody title={__('AOS Settings', 'gutenberg-aos')} >
							<PanelRow>
								<ToggleControl
									label={__('Animate on scroll', 'gutenberg-aos')}
									checked={!!gutenbergUseAOS}
									onChange={() => setAttributes({ gutenbergUseAOS: !gutenbergUseAOS })}
									help={!!gutenbergUseAOS ? __('Animate Element when it\'s inside the users viewport', 'gutenberg-aos') : __('Don\'t animate Element when it\'s inside the users viewport', 'gutenberg-aos')}
								/>
							</PanelRow>
							<PanelRow>
								<SelectControl
									label="Animation"
									value={gutenbergAOSAnimation}
									options={[
										{
											label: 'Fade Up',
											value: 'fade-up'
										},
										{
											label: 'Fade Down',
											value: 'fade-down'
										},
										{
											label: 'Fade Right',
											value: 'fade-right'
										},
										{
											label: 'Fade Left',
											value: 'fade-left'
										},
										{
											label: 'Fade Up Right',
											value: 'fade-up-right'
										},
										{
											label: 'Fade Up Left',
											value: 'fade-up-left'
										},
										{
											label: 'Fade Down Left',
											value: 'fade-down-left'
										},
										{
											label: 'Fade Down Right',
											value: 'fade-down-right'
										},
										{
											label: 'Flip Left',
											value: 'flip-left'
										},
										{
											label: 'Flip Right',
											value: 'flip-right'
										},
										{
											label: 'Flip Up',
											value: 'flip-up'
										},
										{
											label: 'Flip Down',
											value: 'flip-down'
										},
										{
											label: 'Zoom In',
											value: 'zoom-in'
										},
										{
											label: 'Zoom In Up',
											value: 'zoom-in-up'
										},
										{
											label: 'Zoom In Down',
											value: 'zoom-in-down'
										},
										{
											label: 'Zoom In Left',
											value: 'zoom-in-left'
										},
										{
											label: 'Zoom In Right',
											value: 'zoom-in-right'
										},
										{
											label: 'Zoom Out',
											value: 'zoom-out'
										},
										{
											label: 'Zoom Out Up',
											value: 'zoom-out-up'
										},
										{
											label: 'Zoom Out Down',
											value: 'zoom-out-down'
										},
										{
											label: 'Zoom Out Right',
											value: 'zoom-out-right'
										},
										{
											label: 'Zoom Out Left',
											value: 'zoom-out-left'
										}
									]}
									onChange={(gutenbergAOSAnimation) => props.setAttributes({ gutenbergAOSAnimation: gutenbergAOSAnimation })}
								/>
							</PanelRow>
						</PanelBody>
					</InspectorControls>
				}
			</Fragment>
		);
	};
}, 'gutenbergAOSControls');

/**
 * Add custom element class in save element.
 *
 * @param {Object} extraProps     Block element.
 * @param {Object} blockType      Blocks object.
 * @param {Object} attributes     Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
function gutenbergAOSApplyAttributes(extraProps, blockType, attributes) {

	if (blockType.name.substring(0, 5) !== 'core/') {
		return extraProps;
	}

	const {
		gutenbergUseAOS,
		gutenbergAOSAnimation
	} = attributes;

	//check if attribute exists for old Gutenberg version compatibility
	if (typeof gutenbergUseAOS !== 'undefined' && gutenbergUseAOS) {

		let animationName;
		if (typeof gutenbergAOSAnimation !== 'undefined' && gutenbergAOSAnimation) {
			animationName = gutenbergAOSAnimation;
		} else {
			animationName = 'fade-up';
		}

		extraProps['data-aos'] = animationName;

	}

	return extraProps;

}

addFilter(
	'blocks.registerBlockType',
	'gutenbergaos/attributes',
	gutenbergAOSAttributes
);

addFilter(
	'editor.BlockEdit',
	'gutenbergaos/controls',
	gutenbergAOSControls
);

addFilter(
	'blocks.getSaveContent.extraProps',
	'gutenbergaos/applyAttributes',
	gutenbergAOSApplyAttributes
);
