const {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand
} = require('@aws-sdk/client-s3');

const client = new S3Client({
  endpoint: 'http://localhost:4569',
  region: 'af-south-1',
  forcePathStyle: true,
  credentials: {
    accessKeyId: 'S3RVER',
    secretAccessKey: 'S3RVER'
  }
});

async function uploadTestFile() {
  try {
    await client.send(
      new CreateBucketCommand({
        Bucket: 'kk-payments-receipts'
      })
    );
  } catch (err) {
    // Ignore if bucket already exists
  }

  await client.send(
    new PutObjectCommand({
      Bucket: 'kk-payments-receipts',
      Key: 'receipt-ORD-001.json',
      Body: JSON.stringify({
        orderId: 'ORD-001',
        amount: 2500,
        currency: 'KES'
      }),
      ContentType: 'application/json'
    })
  );

  console.log('Upload complete. Check Terminal 1.');
}

uploadTestFile().catch(console.error);
