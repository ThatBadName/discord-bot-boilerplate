const nouns = require('./animalNames')
const adjectives = require('./adjectives')

function createRandomUsername(amount = 1) {
  if (amount == 1) return generate()

  const names = []
  while (amount > 0) { names.push(generate()); amount-- }
  return names
}

function generate() {
  return adjectives[Math.round(Math.random() * adjectives.length)] + " " + nouns[Math.round(Math.random() * nouns.length)]
}

module.exports = createRandomUsername