const express = require('express');

const port = 3000;

const main = () => {
  try {
    const server = express();

    const router = express.Router();

    router.get( '/api/data', ( req, res ) => {
      res.send([
        { a: 1 },
        { a: 2 },
        { a: 3 },
        { a: 4 },
        { a: 5 }
      ]);
    });

    server.use( router );

    server.listen( port, () => console.log( `server listening on port ${ port }!` ) );
  } catch ( ex ) {
    console.error( 'global exception:', ex );
  }
};

main();
