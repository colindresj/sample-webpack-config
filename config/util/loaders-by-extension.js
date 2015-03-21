module.exports = function loadersByExtension(obj) {
  'use strict';

  var loaders = [];

  var extensions = Object.keys(obj).map(function(key) {
    return key.split('|');
  }).reduce(function(arr, a) {
    arr.push.apply(arr, a);
    return arr;
  }, []);

  Object.keys(obj).forEach(function(key) {
    var extensions = key.split('|');
    var value = obj[key];

    var entry = {
      extensions: extensions,
      test: extensionsToRegEx(extensions),
      loaders: value
    };

    if (Array.isArray(value)) {
      entry.loaders = value;
    } else if(typeof value === 'string') {
      entry.loader = value;
    } else {
      Object.keys(value).forEach(function(key) {
        entry[key] = value[key];
      });
    }

    loaders.push(entry);
  });

  return loaders;
};

function extensionsToRegEx(extensions) {
  return new RegExp('\\.(' + extensions.map(function(ext) {
    return ext.replace(/\./g, '\\.') + '(\\?.*)?';
  }).join('|') + ')$');
}
