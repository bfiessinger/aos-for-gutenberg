/**
 * WordPress Dependencies
 */
const { __ } = wp.i18n;
const { addFilter } = wp.hooks;
const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor;
const { createHigherOrderComponent, withState } = wp.compose;
const { ToggleControl, SelectControl, PanelBody, PanelRow, TextControl } = wp.components;



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
			},
			gutenbergAOSDelay: {
				type: 'number',
				default: 0,
			},
			gutenbergAOSDuration: {
				type: 'number',
				default: 400,
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
			gutenbergAOSAnimation,
			gutenbergAOSDelay,
			gutenbergAOSDuration
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
										/**
										 * Fade animations
										 */
										{
											label: 'Fade',
											value: 'fade'
										},
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
										/**
										 * Flip animations
										 */
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
										/**
										 * Slide animations
										 */
										{
											label: 'Slide Up',
											value: 'slide-up'
										},
										{
											label: 'Slide Down',
											value: 'slide-down'
										},
										{
											label: 'Slide Left',
											value: 'slide-left'
										},
										{
											label: 'Slide Right',
											value: 'slide-right'
										},
										/**
										 * Zoom animations
										 */
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
							<PanelRow>
								<TextControl
									label={__('Delay (ms)', 'gutenberg-aos')}
									value={gutenbergAOSDelay}
									onChange={(value) => setAttributes({ gutenbergAOSDelay: parseInt(value) || 0 })}
									type="number"
									min={0}
									max={2000}
									step={50}
								/>
							</PanelRow>
							<PanelRow>
								<TextControl
									label={__('Duration (ms)', 'gutenberg-aos')}
									value={gutenbergAOSDuration}
									onChange={(value) => setAttributes({ gutenbergAOSDuration: parseInt(value) || 400 })}
									type="number"
									min={0}
									max={2000}
									step={50}
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
		gutenbergAOSAnimation,
		gutenbergAOSDelay,
		gutenbergAOSDuration
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

		if (typeof gutenbergAOSDelay !== 'undefined' && gutenbergAOSDelay !== 0) {
			extraProps['data-aos-delay'] = gutenbergAOSDelay;
		}
		if (typeof gutenbergAOSDuration !== 'undefined' && gutenbergAOSDuration !== 400) {
			extraProps['data-aos-duration'] = gutenbergAOSDuration;
		}

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
