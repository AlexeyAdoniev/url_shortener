import * as http from 'node:http';

const ITERATION_COUNT = 10_000;

const decoder = new TextDecoder()

const body = JSON.stringify({
  "original": "https://facebook.com"
})

const shortIds = new Set();

function makePostRequest(index: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'url-shortener.local',
      port: 8080,
      path: '/urls',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(body),
      }
      
    };

    const req = http.request(options, (res) => {
      console.log(`Request ${index + 1}: Status ${res.statusCode}`);

      res.on('data', (x) => {
      try {
       const response = JSON.parse(decoder.decode(x));
       shortIds.add(response.shortId)
      } catch (e) {
        console.log(e);
      }
        // Consume data to free up memory
      });

      res.on('end', () => {
        resolve();
      });
    });

    req.on('error', (error) => {
      console.error(`Request ${index + 1} error:`, error);
      reject(error);
    });


    req.write(body);
    req.end();
  });
}

async function makePostRequestsInLoop(): Promise<void> {
  console.time('time')
  for (let i = 0; i < ITERATION_COUNT; i++) {
    try {
      await makePostRequest(i);
    } catch (error) {
      console.error(`Request ${i + 1} failed:`, error);
    }
  }
  
  if (shortIds.size !== ITERATION_COUNT) {
    console.log('short id mismatch');
  } else {
    console.log('all good');
  }
  console.timeEnd('time');
  console.log('All requests completed');
}

makePostRequestsInLoop();
