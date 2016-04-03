import Ember from 'ember';
import FileDropTargetComponent from 'ember-file-drop-target/components/file-drop-target';

const { get, set } = Ember;

export default FileDropTargetComponent.extend({

  ///////////////////////////
  // Configuration Options //
  ///////////////////////////

  /**
   * The File object of the selected image.
   *
   * @type {File|null}
   */
  // file: null,

  /**
 * The data URL of the selected image to preview.
 *
 * @type {String}
   */
  previewURL: null,

  /**
   * Should dropped images be read in and a data URL generated?
   *
   * @type {Boolean}
   */
  generatePreviews: true,

  ///////////////////////////////////////////////////////
  // Configuration for the underlying file-drop-target //
  ///////////////////////////////////////////////////////

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
  fileWasDropped(file) {
    this._super.apply(this, arguments);
    if (get(this, 'generatePreviews')) {
      set(this, 'isGeneratingPreview', true);

      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        set(this, 'previewURL', e.target.result);
        set(this, 'isGeneratingPreview', false);
        set(this, 'hasPreview', true);
      };
    }
  },

  ///////////////////
  // Element setup //
  ///////////////////

  classNames: 'image-drop-target',
  classNameBindings: [ 'isLoading', 'isLoaded' ],

  isGeneratingPreview: false,
  hasPreview: false

});
