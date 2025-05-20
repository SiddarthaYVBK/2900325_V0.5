// src/components/UploadAdapterPlugin.js
import MyUploadAdapter from './MyUploadAdapter';

function UploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

export default UploadAdapterPlugin;