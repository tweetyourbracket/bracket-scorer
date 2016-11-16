/* eslint-env mocha */

var assert = require('assert')
var _ = require('lodash')
var BracketScorer = require('../index')

describe('NBA', function () {
  var sport = 'nba'
  var year = '2016'

  it('Should score against an empty master', function () {
    var entry = 'W1423121E1523131FW'
    var master = 'WXXXXXXXEXXXXXXXFX'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 0)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.ok(_.every(s.rounds, function (s) { return s === 0 }))
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.ok(_.every(s.bonus, function (s) { return s === 0 }))
    assert.equal(s.standardPPR, 380)
  })

  it('Should score against an empty master without series scoring', function () {
    var entry = 'W1423121E1523131FW'
    var master = 'WXXXXXXXEXXXXXXXFX'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year,
      scoring: {
        standard: [10, 25, 50, 100]
      }
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 0)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.ok(_.every(s.rounds, function (s) { return s === 0 }))
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.ok(_.every(s.bonus, function (s) { return s === 0 }))
    assert.equal(s.standardPPR, 380)
  })

  it('Should not count a bonus if both participants are not correct', function () {
    var entry = 'W17472737172717E17572737173717FE7'
    var master = 'W17472737172727E17572737173717FE7'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 387)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.deepEqual(s.rounds, [8, 4, 1, 1])
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.deepEqual(s.bonus, [8, 4, 1, 0])
    assert.equal(s.standardPPR, 0)
  })

  it('Should not count a bonus as PPR both teams are not remaining', function () {
    var entry = 'W17472737172717E17572737173717FE7'
    var master = 'W17472737172727E17572737173717FX'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 287)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.deepEqual(s.rounds, [8, 4, 1, 0])
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.deepEqual(s.bonus, [8, 4, 1, 0])
    assert.equal(s.standardPPR, 100)
  })
})

describe('NHL', function () {
  var sport = 'nhl'
  var year = '2016'

  it('Should score against an empty master', function () {
    var entry = 'C133P122M122A122FPMM'
    var master = 'CXXXPXXXMXXXAXXXFXXX'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 0)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.ok(_.every(s.rounds, function (s) { return s === 0 }))
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.ok(_.every(s.bonus, function (s) { return s === 0 }))
    assert.equal(s.standardPPR, 380)
  })

  it('Should score against an empty master without series scoring', function () {
    var entry = 'C133P122M122A122FPMM'
    var master = 'CXXXPXXXMXXXAXXXFXXX'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year,
      scoring: {
        standard: [10, 25, 50, 100]
      }
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 0)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.ok(_.every(s.rounds, function (s) { return s === 0 }))
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.ok(_.every(s.bonus, function (s) { return s === 0 }))
    assert.equal(s.standardPPR, 380)
  })

  it('Should score an entry without series predictions against a master with them', function () {
    var entry = 'C133P122M122A122FPMM'
    var master = 'C143537P142527M142527A142527FP7M7M7'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 380)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.deepEqual(s.rounds, [8, 4, 2, 1])
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.ok(_.every(s.bonus, function (s) { return s === 0 }))
    assert.equal(s.standardPPR, 0)
  })

  it('Should score an entry with series predictions against a master without them', function () {
    var entry = 'C143537P142527M142527A142527FP7M7M7'
    var master = 'C133P122M122A122FPMM'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 380)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.deepEqual(s.rounds, [8, 4, 2, 1])
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.ok(_.every(s.bonus, function (s) { return s === 0 }))
    assert.equal(s.standardPPR, 0)
  })

  it('Should score with perfect series predictions', function () {
    var entry = 'C143537P142527M142527A142527FP7M7M7'
    var master = 'C143537P142527M142527A142527FP7M7M7'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 458)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.deepEqual(s.rounds, [8, 4, 2, 1])
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.deepEqual(s.bonus, [8, 4, 2, 1])
    assert.equal(s.standardPPR, 0)
  })

  it('Should score with perfect predictions but mismatched series in each round', function () {
    var entry = 'C143537P142527M142527A142527FP7M7M7'
    var master = 'C143736P142527M142527A142527FP5M7M5'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 428)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.deepEqual(s.rounds, [8, 4, 2, 1])
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.deepEqual(s.bonus, [7, 3, 1, 0])
    assert.equal(s.standardPPR, 0)
  })

  it('Should count series for PPR', function () {
    var entry = 'C143537P142527M142527A142527FP7M7M7'
    var master = 'C1435XP1425XM1425XA1425XFXXX'
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 104)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.deepEqual(s.rounds, [8, 0, 0, 0])
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.deepEqual(s.bonus, [8, 0, 0, 0])
    assert.equal(s.standardPPR, 354)
  })

  it('Should count series for PPR with eliminated teams', function () {
    var entry = ' C14 35 37 P 14 25 27 M 14 25 27 A 14 25 27 F C7 M7    C7'.replace(/\s*/g, '')
    var master = 'C14 25 X  P 14 25 X  M 14 25 X  A 14 25 X  F X  X     X'.replace(/\s*/g, '')
    //           PPR     0          25+6       25+6       25+6 0  50+0  0
    var scorer = new BracketScorer({
      entry: entry,
      master: master,
      sport: sport,
      year: year
    })

    var s = scorer.score(['standard', 'standardPPR', 'rounds', 'bonus'])

    assert.equal(s.standard, 91)
    assert.equal(true, _.isArray(s.rounds))
    assert.equal(s.rounds.length, 4)
    assert.deepEqual(s.rounds, [7, 0, 0, 0])
    assert.equal(true, _.isArray(s.bonus))
    assert.equal(s.bonus.length, 4)
    assert.deepEqual(s.bonus, [7, 0, 0, 0])
    assert.equal(s.standardPPR, 143)
  })
})
