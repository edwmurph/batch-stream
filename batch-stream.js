const { Transform } = require('stream');

const streamDefaults = { objectMode: true };
const batchOptions   = { batchSize: 2 };

module.exports = class BatchStream extends Transform {

  constructor( streamOpts, batchOpts ) {

    const streamSettings = Object.assign( {}, streamDefaults, streamOpts );
    const batchSettings  = Object.assign( {}, batchOptions, batchOpts );

    super( streamSettings );

    this.batchSize = batchSettings.batchSize;
    this.queue     = [];
  }

  pushBatch() {
    const data = this.queue.slice();
    this.queue = [];
    this.push( data );
  }

  _transform( chunk, enc, next ) {

    this.queue.push( chunk );

    if ( this.queue.length >= this.batchSize ) {
      this.pushBatch();
    }

    next();
  }

  _flush( cb ) {
    if ( this.queue.length ) {
      this.pushBatch();
    }

    cb();
  }

};
