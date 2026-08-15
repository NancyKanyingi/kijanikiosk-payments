'use strict';

const fs = require('fs');
const path = require('path');

module.exports.aggregate = async (event) => {
  const summaries = [];

  for (const record of (event.Records || [])) {
    const key = decodeURIComponent(
      record.s3.object.key.replace(/\+/g, ' ')
    );

    const bucket = record.s3.bucket.name;

    const filePath = path.join(
      '/tmp/kijani-s3-local',
      bucket,
      key
    );

    const receipt = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    summaries.push(receipt);
  }

  const amounts = summaries.map(r => Number(r.amount || 0));
  const timestamps = summaries
    .map(r => r.timestamp)
    .filter(Boolean)
    .sort();

  const report = {
    receiptCount: summaries.length,
    totalAmount: amounts.reduce((a, b) => a + b, 0),
    firstReceipt: timestamps[0] || null,
    lastReceipt: timestamps[timestamps.length - 1] || null,
    generatedAt: new Date().toISOString()
  };

  console.log(
    JSON.stringify({
      level: 'INFO',
      service: 'kk-analytics',
      event: 'analytics.summary',
      report
    })
  );

  const outputDir = '/tmp/kijani-s3-local/kk-analytics-output-dev';
  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, 'analytics-summary.json'),
    JSON.stringify(report, null, 2)
  );

  return {
    statusCode: 200,
    body: JSON.stringify(report)
  };
};
