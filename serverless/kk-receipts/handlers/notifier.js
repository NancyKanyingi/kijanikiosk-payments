'use strict';

const fs = require('fs');
const path = require('path');

const notify = async (event) => {
  for (const record of event.Records) {
    const key = decodeURIComponent(
      record.s3.object.key.replace(/\+/g, ' ')
    );

    const orderId = key
      .replace(/^processed-/, '')
      .replace(/\.json$/, '');

    const notification = {
      orderId,
      amount: 250,
      timestamp: new Date().toISOString(),
      status: 'NOTIFIED'
    };

    // Week 10 behaviour: structured log
    console.log(
      JSON.stringify({
        service: 'kk-notifier',
        event: 'notification.dispatched',
        channel: process.env.NOTIFICATION_CHANNEL,
        ...notification
      })
    );

    // Capstone extension: publish analytics event
    const outputDir = '/tmp/kijani-s3-local/kk-notifications-queue-dev';
    fs.mkdirSync(outputDir, { recursive: true });

    fs.writeFileSync(
      path.join(outputDir, `notify-${orderId}.json`),
      JSON.stringify(notification, null, 2)
    );
  }

  return { statusCode: 200 };
};

module.exports = { notify };

