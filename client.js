const axios = require('axios');
const util = require('util');
const stream = require('stream');
const JSONStream = require('JSONStream');
const BatchStream = require('./batch-stream');

const pipeline = util.promisify( stream.pipeline );
const port = 3000;

const write_stream = new stream.Writable({
  objectMode: true,
  highWaterMark: 2,
  async write( chunk, enc, next ) {
    try {
      console.log( 'chunk', chunk );
      next();
    } catch ( ex ) {
      next( ex );
    }
  }
});

async function main() {
  const { data: stream } = await axios.get(
    `http://localhost:${ port }/api/data`,
    { responseType: 'stream' }
  );

  await pipeline(
    stream,
    JSONStream.parse('*'),
    new BatchStream( {}, { batchSize: 2 } ),
    write_stream
  );
}

main()
  .then( console.log, console.error )
  .finally( () => process.exit( 0 ) );
