<?php

/**
 * Plugin Name: AOS Animations for Gutenberg
 * Description: Animate Gutenberg Blocks on scroll
 * Version: 1.0.0
 * Author: Bastian Fießinger
 * AuthorURI: https://github.com/bfiessinger/
 */

namespace bf\gutenberg\aos;

class aos {

	/**
	 * Static variable for instanciation
	 */
	protected static $instance = null;

	/**
	 * Get current Instance
	 */
	public static function getInstance() {

		if ( null === self::$instance ) {
			self::$instance = new self;
		}
		return self::$instance;

	}

	protected function __clone() {}

	protected function __construct() {
		
		$this->define_constants();

		// Init Plugin
		add_action( 'plugins_loaded', [ $this, 'init' ] );

	}

	function define_constants() {

		define( 'gutenberg_aos_plugin_url', plugin_dir_url( __FILE__ ) );

	}

	function init() {

		// Enqueue Editor Scripts
		add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ], 202 );

		// Enqueue FrontEnd Scripts
		add_action( 'wp_enqueue_scripts', [ $this, 'enqueue_aos_script' ] );

	}

	function enqueue_block_editor_assets() {

		wp_enqueue_script(
			'block-aos-support',
			gutenberg_aos_plugin_url . 'dist/js/block_editor.js',
			[ 
				'wp-blocks', 
				'wp-i18n', 
				'wp-element', 
				'wp-plugins', 
				'wp-components', 
				'wp-edit-post', 
				'wp-api', 
				'wp-editor', 
				'wp-hooks'
			],
		);

	}

	function enqueue_aos_script() {

		wp_enqueue_script( 
			'aos',
			gutenberg_aos_plugin_url . 'dist/js/aos.js',
			[],
			null,
			true
		);

		wp_enqueue_style(
			'aos',
			gutenberg_aos_plugin_url . 'dist/css/aos.css',
			[],
			null,
			'all'
		);

	}

}

aos::getInstance();
