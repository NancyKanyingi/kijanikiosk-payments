const crypto = require('crypto');

const generateReceipt = async (event) => {
  let body;

  try {
    body = typeof event.body === 'string'
      ? JSON.parse(event.body || '{}')
      : (event.body || {});
  } catch (err) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'Invalid JSON request body'
      })
    };
  }

  if (!body.orderId || body.amount === undefined) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: 'orderId and amount are required'
      })
    };
  }

  const receipt = {
    receiptId: crypto.randomUUID(),
    orderId: body.orderId,
    amount: body.amount,
    currency: body.currency || process.env.DEFAULT_CURRENCY,
    timestamp: new Date().toISOString(),
    status: 'generated'
  };

  console.log(`[kk-receipts] Receipt generated for order ${receipt.orderId}`);

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(receipt)
  };
};
const processReceiptUpload = async (event) => {
  for (const record of event.Records) {
    const bucketName = record.s3.bucket.name;
    const objectKey = decodeURIComponent(
      record.s3.object.key.replace(/\+/g, ' ')
    );
    const fileSizeBytes = record.s3.object.size;
    const uploadedAt = record.eventTime;

    let orderId = objectKey
      .replace(/^receipt-/, "")
      .replace(/\.json$/, "");

    const malformed =
      orderId === "" || orderId === objectKey;

    if (malformed) {
      orderId = "UNKNOWN";
    }

    const logEntry = {
      service: "kk-receipts",
      event: "receipt.upload.received",
      orderId,
      bucketName,
      objectKey,
      fileSizeBytes,
      uploadedAt,
      processedAt: new Date().toISOString(),
      currency: process.env.DEFAULT_CURRENCY,
      ...(malformed && {
        warning: "malformed key: could not extract orderId"
      })
    };

console.log(JSON.stringify(logEntry));
  }

  return "Upload processed";
};

module.exports = { generateReceipt, processReceiptUpload };
