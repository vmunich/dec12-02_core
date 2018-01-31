const chai = require('chai')
const should = chai.should()

class Helpers {
  request (method, path, params = {}) {
    let request = chai
      .request('http://localhost:4003/api/')

    request = request[method.toLowerCase()](path)
    request = (method === 'GET') ? request.query(params) : request.send(params)

    return request.set('Accept-Version', '2.0.0')
  }

  assertJson (data) {
    data.body.should.be.a('object')
  }

  assertStatus (data, code) {
    data.should.have.status(code)
  }

  assertVersion (data, version) {
    data.body.should.have.property('meta').which.is.an('object')
    data.body.meta.should.have.property('matchedVersion').eql(version)
  }

  assertResource (data) {
    data.body.should.have.property('data').which.is.an('object')
  }

  assertCollection (data) {
    data.body.should.have.property('data').which.is.an('array')
  }

  assertPaginator (data, firstPage = true) {
    data.body.should.have.property('links').which.is.an('object')

    if (!firstPage) {
      data.body.links.should.have.property('first').which.is.a('string')
      data.body.links.should.have.property('prev').which.is.a('string')
    }

    data.body.links.should.have.property('last').which.is.a('string')
    data.body.links.should.have.property('next').which.is.a('string')
  }

  assertSuccessful (err, res, statusCode = 200) {
    should.not.exist(err)
    this.assertStatus(res, statusCode)
    this.assertJson(res)
    this.assertVersion(res, '2.0.0')
  }

  assertError (err, res, statusCode = 404) {
    err.should.be.an('Error')
    this.assertStatus(res, statusCode)
    this.assertJson(res)
    res.body.should.have.property('code')
    res.body.should.have.property('message')
  }

  assertTransaction (transaction) {
    transaction.should.be.an('object')
    transaction.should.have.property('id').which.is.a('string')
    transaction.should.have.property('block_id').which.is.a('string')
    transaction.should.have.property('type').which.is.a('number')
    transaction.should.have.property('amount').which.is.a('number')
    transaction.should.have.property('fee').which.is.a('number')
    transaction.should.have.property('sender').which.is.a('string')
    if ([1, 2].indexOf(transaction.type) === -1) {
      transaction.should.have.property('recipient').which.is.a('string')
    }
    transaction.should.have.property('signature').which.is.a('string')
    transaction.should.have.property('confirmations').which.is.a('number')
  }

  assertBlock (block) {
    block.should.be.an('object')
    block.should.have.property('id').which.is.a('string')
    block.should.have.property('version').which.is.a('number')
    block.should.have.property('height').which.is.a('number')
    block.should.have.property('previous').which.is.a('string')

    block.should.have.property('forged').which.is.an('object')
    block.forged.should.have.property('reward').which.is.an('number')
    block.forged.should.have.property('fee').which.is.an('number')

    block.should.have.property('payload').which.is.an('object')
    block.payload.should.have.property('length').which.is.an('number')
    block.payload.should.have.property('hash').which.is.an('string')

    block.should.have.property('generator').which.is.an('object')
    block.generator.should.have.property('public_key').which.is.an('string')

    block.should.have.property('signature').which.is.an('string')
    block.should.have.property('transactions').which.is.an('number')
  }

  assertWallet(wallet) {
    wallet.should.have.property('address').which.is.a('string')
    wallet.should.have.property('public_key').which.is.a('string')
    wallet.should.have.property('balance').which.is.a('number')
    wallet.should.have.property('is_delegate').which.is.a('boolean')
  }
}

module.exports = new Helpers()