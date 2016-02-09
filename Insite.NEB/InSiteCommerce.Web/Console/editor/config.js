/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here. For example:
    // config.language = 'fr';
    // config.uiColor = '#AADC6E';
    config.autoParagraph = false;
    config.allowedContent = true;
    config.extraPlugins = 'imagemaps,switchbar';

    // switchbar plugin parameters
    config.switchBarSimple = 'Basic';
    config.switchBarReach = 'Full';
    config.switchBarDefault = 'Basic';

    config.toolbar = 'Basic';

    config.toolbar_Basic = [
        ['SwitchBar', '-', 'Source', '-', 'Find', 'Replace'],
        ['Bold', 'Italic', 'NumberedList', 'BulletedList'],
        ['Link', 'Unlink', 'Image', 'ImageMaps'],
        ['Styles', 'Format', 'Font', 'FontSize', 'TextColor']
    ];

    //TODO: 3.7.1 Add/Fix "Maximize" button and functionality.
    config.toolbar_Full = [
        ['SwitchBar', '-', 'Source', '-', 'NewPage'],
        ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Print', 'SpellChecker', 'Scayt'],
        ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
        '/',
        ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
        ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote', 'CreateDiv'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['BidiLtr', 'BidiRtl'],
        ['Link', 'Unlink', 'Anchor'],
        ['Image', 'ImageMaps', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak'],
        '/',
        ['Styles', 'Format', 'Font', 'FontSize'],
        ['TextColor', 'BGColor'],
        ['ShowBlocks', 'About']
    ];
};