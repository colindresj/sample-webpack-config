var fs = require('fs');
var path = require('path');

module.exports = function(exclusions, publicPath) {
  return function(stats) {
    var jsonStats = stats.toJson({
      chunkModules: true,
      exclude: exclusions
    });

    jsonStats.publicPath = publicPath;

    var dirTo = path.join(__dirname, '../../public/application');

    (function writeStats() {
      try {
        fs.writeFileSync(
          path.join(dirTo, 'bundle-stats.json'),
          JSON.stringify(jsonStats)
        );
      } catch(e) {
        fs.mkdirSync(dirTo);
        writeStats();
      }
    })();
  };
};
