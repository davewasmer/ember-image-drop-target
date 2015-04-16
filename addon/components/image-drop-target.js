import Ember from 'ember';
import FileDropTargetComponent from 'ember-file-drop-target/components/file-drop-target';

export default FileDropTargetComponent.extend({

  ///////////////////////////
  // Configuration Options //
  ///////////////////////////

  /**
   * The URL of the image to display. Should most likely be the URL of the
   * uploaded file, or the preview data URL received from the preview action.
   *
   * @type {String|null}
   */
  url: null,

  /**
   * Allow the user to crop the image.
   *
   * @type {Boolean}
   */
  allowCropping: false,

  /**
   * URL of an image to display if no file is selected, or null to disable
   *
   * @type {String|null}
   */
  fallback: null,

  /**
   * Options to pass to the cropper jQuery plugin. Receives the selected File
   * object as the single argument.
   *
   * @params {File} file - the selected File object
   */
  cropOptions() {
    return {
      modal: true,
      autoCrop: true,
      autoCropArea: 1,
      dragCrop: false,
      movable: false,
      resizable: false
    };
  },


  ////////////////////////////////////
  // file-drop-target configuration //
  ////////////////////////////////////

  /**
   * Restrict to image mime types.
   */
  allowedTypes: /image\.*/i,

  /**
   * Multiple image uploads are much more complex and probably warrant a unique
   * interface.
   */
  allowMultiple: false,

  /**
   * Override the fileDropped hook supplied by file-drop-target to process the
   * image preview
   */
  fileDropped(file) {
    this.set('isLoading', true);
    this.set('isLoaded', false);

    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      this.sendAction('preview', e.target.result);
      this.set('isLoading', false);
      this.set('isLoaded', true);
      if (this.get('crop')) {
        this.cropImage();
      }
    };
  },

  ///////////////////
  // Element setup //
  ///////////////////

  classNames: 'image-drop-target',
  classNameBindings: [ 'isLoading', 'isLoaded' ],

  isLoading: false,
  isLoaded: false,

  cropImage() {
    var $image = this.$('img');
    var cropOptions = this.get('cropOptions');
    $image.cropper(cropOptions);
  },

  imageUrl: Ember.computed('url', 'fallback', function() {
    return this.get('url') || this.get('fallback') || '';
  })

});
