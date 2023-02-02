const axios = require('axios');
const util = require('util');
const stream = require('stream');
const stream_array = require('stream-json/streamers/StreamArray');
const Batch = require('stream-json/utils/Batch');

const pipeline = util.promisify( stream.pipeline );
const port = 3000;

const write_stream = new stream.Writable({
  objectMode: true,
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
  const { data: axios_stream } = await axios.get(
    `http://localhost:${ port }/api/data`,
    { responseType: 'stream' }
  );

  await pipeline(
    axios_stream,
    stream_array.withParser(),
    new Batch({ batchSize: 2 }),
    write_stream
  );

  console.log('finished pipeline!');
}

main()
  .then( console.log, console.error )
  .finally( () => process.exit( 0 ) );
