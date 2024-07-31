<?php

/**
 * Plugin Name: AOS Animations for Gutenberg
 * Description: Animate Gutenberg Blocks on scroll with customizable delay and duration
 * Version: 1.1.0
 * Author: Bastian Fießinger (modified)
 * Author URI: https://github.com/bfiessinger/
 */

namespace bf\gutenberg\aos;

class aos {

    public $use_aos_for_post = false;

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
        add_action( 'plugins_loaded', [ $this, 'init' ] );
    }

    function define_constants() {
        if ( ! defined( 'gutenberg_aos_plugin_url' ) )
            define( 'gutenberg_aos_plugin_url', plugin_dir_url( __FILE__ ) );
    }

    function init() {
        add_action( 'enqueue_block_editor_assets', [ $this, 'enqueue_block_editor_assets' ], 202 );
        add_action( 'init', [ $this, 'register_aos_script' ] );
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
            ]
        );
    }

    function register_aos_script() {
        wp_register_script( 
            'aos',
            gutenberg_aos_plugin_url . 'dist/js/aos.js',
            [],
            null,
            true
        );

        wp_register_style(
            'aos',
            gutenberg_aos_plugin_url . 'dist/css/aos.css',
            [],
            null,
            'all'
        );
    }

    private function check_inner_blocks( array $blocks ) {
        foreach ( $blocks as $block ) {
            if ( is_array( $block ) && $this->block_is_aos( $block ) )
                return;

            if ( isset( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) && ! empty( $block['innerBlocks'] ) )
                $this->check_inner_blocks( $block['innerBlocks'] );
        }
    }

    private function block_is_aos( array $block ) {
        if ( isset( $block['attrs']['gutenbergUseAOS'] ) && $block['attrs']['gutenbergUseAOS'] !== false ) {
            $this->use_aos_for_post = true;
            return true;
        }
        
        return false;
    }

    function enqueue_aos_script() {
        global $post;
        
        if ( ! $post ) return;
        
        $blocks_parsed = parse_blocks( $post->post_content );

        $this->check_inner_blocks( $blocks_parsed );

        if ( $this->use_aos_for_post !== false ) {
            wp_enqueue_script( 'aos' );
            wp_enqueue_style( 'aos' );
        }
    }
}

aos::getInstance();