const dynamoose = require('dynamoose')

dynamoose.AWS.config.update({
  accessKeyId: 'AKIA4RN7LHMEODSFNUHM',
  secretAccessKey: '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',
  region: 'us-east-1'
})

module.exports = { dynamoose }
